# Complete AWS ECS Deployment Guide - All Steps in Order

**Follow this guide from top to bottom. Don't skip steps!**

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] AWS Account created
- [ ] Docker installed locally: `docker --version`
- [ ] AWS CLI installed: `aws --version`
- [ ] AWS CLI configured: `aws configure` (you'll need Access Key ID and Secret Access Key)
- [ ] Your application with a working Dockerfile
- [ ] VS Code installed (for later steps)

**Get your AWS Account ID:**
```bash
aws sts get-caller-identity --query Account --output text
```
**Save this:** `Account ID: ___________________`

---

## 🎯 Deployment Steps Overview

```
Step 0: Create IAM Roles         ← Critical! Do this first
Step 1: Create VPC
Step 2: Configure Security Groups
Step 3: Create Secrets Manager
Step 4: Create ECR Repository
Step 5: Create CloudWatch Log Group
Step 6: Create ECS Cluster
Step 7: Create Task Definition
Step 8: Create ECS Service
Step 9: Deploy Your Application
Step 10: VS Code Setup
```

---

# STEP 0: CREATE IAM ROLES ⚠️ CRITICAL - DO THIS FIRST!

## Why First?
Without IAM roles, your ECS tasks cannot:
- Pull Docker images from ECR
- Write logs to CloudWatch
- Read secrets from Secrets Manager

## Two Roles Needed:

### 1. Task Execution Role (REQUIRED)
**Purpose:** Used by ECS service to manage your container

### 2. Task Role (OPTIONAL)
**Purpose:** Used by your app code to access AWS services (S3, DynamoDB, etc.)
**Only create if:** Your application uses AWS SDK to call AWS services

---

## Create Task Execution Role

### Method A: AWS Console (Recommended for first time)

1. **Go to AWS Console** → Search for **IAM** → Click **Roles** → **Create role**

2. **Select trusted entity:**
   - Trusted entity type: **AWS service**
   - Use case: **Elastic Container Service**
   - Select: **Elastic Container Service Task**
   - Click **Next**

3. **Attach permissions policies:**
   Search and check these boxes:
   - ✅ `AmazonECSTaskExecutionRolePolicy`
   - ✅ `AmazonEC2ContainerRegistryReadOnly`
   
   Click **Next**

4. **Name the role:**
   - Role name: `ecsTaskExecutionRole`
   - Description: "Allows ECS tasks to call AWS services"
   - Click **Create role**

5. **Add Secrets Manager permissions:**
   - Find the role you just created: IAM → Roles → Search `ecsTaskExecutionRole`
   - Click on the role
   - Click **Add permissions** → **Create inline policy**
   - Click **JSON** tab
   - Paste this policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue",
           "kms:Decrypt"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   - Click **Review policy**
   - Policy name: `SecretsManagerAccess`
   - Click **Create policy**

6. **Verify:**
   ```bash
   aws iam get-role --role-name ecsTaskExecutionRole
   aws iam list-attached-role-policies --role-name ecsTaskExecutionRole
   ```
   Should show: AmazonECSTaskExecutionRolePolicy, AmazonEC2ContainerRegistryReadOnly

### Method B: AWS CLI (Faster)

```bash
# Create trust policy file
cat > task-execution-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create the role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://task-execution-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

# Add Secrets Manager access
cat > secrets-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["secretsmanager:GetSecretValue", "kms:Decrypt"],
    "Resource": "*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name SecretsManagerAccess \
  --policy-document file://secrets-policy.json

# Verify
aws iam get-role --role-name ecsTaskExecutionRole
```

**✅ SAVE THIS:**
```
Task Execution Role ARN: arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole
```

---

## Create Task Role (OPTIONAL - Skip if your app doesn't use AWS services)

**Only create this if your application needs to:**
- Upload/download files to S3
- Read/write to DynamoDB
- Send messages to SQS/SNS
- Access any other AWS services via AWS SDK

### Via AWS Console:

1. **IAM** → **Roles** → **Create role**
2. **AWS service** → **Elastic Container Service** → **Elastic Container Service Task** → **Next**
3. **Attach policies based on your needs:**
   - For S3: `AmazonS3FullAccess` (or create custom policy for specific bucket)
   - For DynamoDB: `AmazonDynamoDBFullAccess`
   - For SQS: `AmazonSQSFullAccess`
4. **Name:** `ecsTaskRole`
5. **Create role**

### Via AWS CLI:

```bash
# Create the role
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document file://task-execution-trust-policy.json

# Attach policies (example for S3)
aws iam attach-role-policy \
  --role-name ecsTaskRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

**✅ SAVE THIS (if created):**
```
Task Role ARN: arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole
```

---

# STEP 1: CREATE VPC (VIRTUAL PRIVATE CLOUD)

## Purpose
VPC provides network isolation for your containers.

## Steps:

1. **Go to AWS Console** → Search for **VPC** → Click **Create VPC**

2. **Select VPC settings:**
   - Select: **VPC and more** (this creates everything automatically)

3. **Configuration:**
   ```
   Name tag auto-generation: my-app
   IPv4 CIDR block: 10.0.0.0/16
   IPv6 CIDR block: No IPv6 CIDR block
   Tenancy: Default
   
   Number of Availability Zones (AZs): 2
   Number of public subnets: 2
   Number of private subnets: 2
   
   NAT gateways ($): None (for testing) OR 1 per AZ (for production)
   VPC endpoints: S3 Gateway
   
   DNS options: ✅ Enable DNS hostnames
                ✅ Enable DNS resolution
   ```

4. Click **Create VPC**

5. **Wait** for creation to complete (~2-3 minutes)

## Verify:

```bash
# List your VPCs
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0],CidrBlock]' --output table
```

**✅ SAVE THESE VALUES:**
```
VPC ID: vpc-_______________________
Public Subnet 1 ID: subnet-_______________________
Public Subnet 2 ID: subnet-_______________________
Private Subnet 1 ID: subnet-_______________________
Private Subnet 2 ID: subnet-_______________________
Default Security Group ID: sg-_______________________
```

**Where to find these:**
- VPC Dashboard → Your VPCs → Click on your VPC
- VPC Dashboard → Subnets → Filter by your VPC

---

# STEP 2: CONFIGURE SECURITY GROUPS

## Purpose
Security groups control inbound and outbound traffic to your containers.

## Steps:

1. **Go to VPC Dashboard** → **Security Groups**

2. **Find the default security group** created with your VPC
   - Look for one with your VPC ID
   - Name will be "default" or similar

3. **Edit inbound rules:**
   - Click on the security group
   - Click **Edit inbound rules**
   - Click **Add rule** for each of these:

   ```
   Rule 1 (Your Application):
   Type: Custom TCP
   Port range: YOUR_APP_PORT (e.g., 3000, 8080, 8000)
   Source: 0.0.0.0/0 (or Anywhere-IPv4)
   Description: Application port
   
   Rule 2 (HTTP - if you need it):
   Type: HTTP
   Port range: 80
   Source: 0.0.0.0/0
   Description: HTTP traffic
   
   Rule 3 (HTTPS - if you need it):
   Type: HTTPS
   Port range: 443
   Source: 0.0.0.0/0
   Description: HTTPS traffic
   ```

4. Click **Save rules**

5. **Verify outbound rules:**
   - Click **Outbound rules** tab
   - Should have: All traffic to 0.0.0.0/0 (this is default and needed)

## Verify:

```bash
aws ec2 describe-security-groups --group-ids YOUR_SECURITY_GROUP_ID
```

**✅ SAVE THIS:**
```
Security Group ID: sg-_______________________
Application Port: _______________________
```

---

# STEP 3: CREATE SECRETS IN SECRETS MANAGER

## Purpose
Store sensitive data like database passwords, API keys, etc.

## Steps:

1. **Go to AWS Console** → Search for **Secrets Manager** → **Store a new secret**

2. **Select secret type:**
   - Select: **Other type of secret**

3. **Add your key/value pairs:**
   Click **+ Add row** for each secret:
   ```
   Key: DATABASE_PASSWORD    | Value: your_db_password
   Key: API_KEY              | Value: your_api_key
   Key: JWT_SECRET           | Value: your_jwt_secret
   Key: STRIPE_SECRET_KEY    | Value: sk_live_xxxxx
   (Add all your sensitive environment variables)
   ```

4. **Encryption key:**
   - Leave as: aws/secretsmanager (default)

5. Click **Next**

6. **Secret name:**
   - Secret name: `my-app-secrets`
   - Description: "Secrets for my application"

7. Click **Next** → **Next** → **Store**

8. **Copy the Secret ARN:**
   - Click on your secret
   - Copy the ARN (looks like: `arn:aws:secretsmanager:us-east-1:123456789:secret:my-app-secrets-AbCdEf`)

## Verify:

```bash
aws secretsmanager describe-secret --secret-id my-app-secrets
```

**✅ SAVE THIS:**
```
Secret Name: my-app-secrets
Secret ARN: arn:aws:secretsmanager:REGION:ACCOUNT:secret:my-app-secrets-______
```

## Important Notes:

**For non-sensitive environment variables** (like `NODE_ENV=production`, `PORT=3000`):
- Don't put these in Secrets Manager
- You'll add these directly to Task Definition later

---

# STEP 4: CREATE ECR REPOSITORY

## Purpose
ECR stores your Docker images in AWS.

## Steps:

1. **Go to AWS Console** → Search for **ECR** (Elastic Container Registry)

2. Click **Get Started** or **Create repository**

3. **Configuration:**
   ```
   Visibility settings: Private
   Repository name: my-app-repo
   Tag immutability: Disabled
   Scan on push: ✅ Enabled (optional, for security scanning)
   KMS encryption: Disabled (or enabled for extra security)
   ```

4. Click **Create repository**

5. **Copy the Repository URI:**
   - It looks like: `123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app-repo`

## Verify:

```bash
aws ecr describe-repositories --repository-names my-app-repo
```

**✅ SAVE THIS:**
```
Repository Name: my-app-repo
Repository URI: ______________.dkr.ecr.REGION.amazonaws.com/my-app-repo
```

## Push Your First Image:

```bash
# 1. Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI

# 2. Build your Docker image (in your app directory)
docker build -t my-app-repo .

# 3. Tag your image
docker tag my-app-repo:latest YOUR_ECR_URI:latest

# 4. Push to ECR
docker push YOUR_ECR_URI:latest
```

Replace:
- `us-east-1` with your region
- `YOUR_ECR_URI` with your actual repository URI

## Verify image was pushed:

```bash
aws ecr list-images --repository-name my-app-repo
```

---

# STEP 5: CREATE CLOUDWATCH LOG GROUP

## Purpose
CloudWatch stores your application logs.

## Steps:

1. **Go to AWS Console** → Search for **CloudWatch**

2. In left sidebar → **Logs** → **Log groups** → **Create log group**

3. **Configuration:**
   ```
   Log group name: /ecs/my-app
   Retention setting: 7 days (for dev) or 30 days (for prod)
   KMS encryption: (optional, leave default)
   ```

4. Click **Create**

## Via AWS CLI (Faster):

```bash
aws logs create-log-group --log-group-name /ecs/my-app

# Set retention
aws logs put-retention-policy \
  --log-group-name /ecs/my-app \
  --retention-in-days 7
```

## Verify:

```bash
aws logs describe-log-groups --log-group-name-prefix /ecs/my-app
```

**✅ SAVE THIS:**
```
Log Group Name: /ecs/my-app
```

---

# STEP 6: CREATE ECS CLUSTER

## Purpose
A cluster is a logical grouping of ECS tasks/services.

## Steps:

1. **Go to AWS Console** → Search for **ECS** (Elastic Container Service)

2. Click **Clusters** → **Create Cluster**

3. **Configuration:**
   ```
   Cluster name: my-app-cluster
   
   Infrastructure: AWS Fargate (serverless)
   
   Monitoring: 
   ✅ Use Container Insights (optional, costs extra but useful)
   
   Tags (optional):
   Key: Environment | Value: production
   ```

4. Click **Create**

## Via AWS CLI:

```bash
aws ecs create-cluster --cluster-name my-app-cluster
```

## Verify:

```bash
aws ecs describe-clusters --clusters my-app-cluster
```

**✅ SAVE THIS:**
```
Cluster Name: my-app-cluster
Cluster ARN: arn:aws:ecs:REGION:ACCOUNT:cluster/my-app-cluster
```

---

# STEP 7: CREATE TASK DEFINITION

## Purpose
Task Definition defines how your container should run (image, CPU, memory, environment variables, etc.)

## Steps:

1. **Go to ECS Console** → **Task Definitions** → **Create new task definition**

2. **Task definition family:** `my-app-task`

3. **Container - 1:**

   **Basic settings:**
   ```
   Container name: my-app-container
   Image URI: YOUR_ECR_URI:latest
   Essential container: Yes
   ```

   **Port mappings:**
   ```
   Container port: YOUR_APP_PORT (e.g., 3000, 8080)
   Protocol: TCP
   Port name: app-port (optional)
   App protocol: HTTP
   ```

   **Environment variables - NON-SENSITIVE:**
   Click **Add environment variable** for each:
   ```
   NODE_ENV = production
   PORT = 3000
   LOG_LEVEL = info
   (Add your non-sensitive vars)
   ```

   **Environment variables - SECRETS:**
   For each secret, use **ValueFrom**:
   ```
   Name: DATABASE_PASSWORD
   Value type: ValueFrom
   Value: arn:aws:secretsmanager:REGION:ACCOUNT:secret:my-app-secrets-xxxxx:DATABASE_PASSWORD::
   
   Name: API_KEY
   Value type: ValueFrom
   Value: arn:aws:secretsmanager:REGION:ACCOUNT:secret:my-app-secrets-xxxxx:API_KEY::
   ```
   
   ⚠️ **Important:** The format is `SECRET_ARN:KEY_NAME::`
   Example: If your secret ARN is `arn:aws:secretsmanager:us-east-1:123:secret:my-app-secrets-AbCdEf`
   and you want the `DATABASE_PASSWORD` key, use:
   `arn:aws:secretsmanager:us-east-1:123:secret:my-app-secrets-AbCdEf:DATABASE_PASSWORD::`

   **Health check (optional but recommended):**
   ```
   Command: CMD-SHELL,curl -f http://localhost:YOUR_PORT/health || exit 1
   Interval: 30
   Timeout: 5
   Start period: 60
   Retries: 3
   ```

   **Logging:**
   ```
   Log driver: awslogs
   Log options:
     awslogs-group: /ecs/my-app
     awslogs-region: us-east-1 (or your region)
     awslogs-stream-prefix: ecs
   ```

4. **Environment:**

   **App environment:**
   ```
   Operating system/Architecture: Linux/X86_64 (or ARM64 if using ARM)
   ```

   **Task size:**
   ```
   CPU: .5 vCPU (or 1 vCPU, 2 vCPU based on your needs)
   Memory: 1 GB (or 2 GB, 4 GB based on your needs)
   ```
   
   Start with smaller sizes, you can always increase later!

   **Task roles:**
   ```
   Task role: ecsTaskRole (select if you created it in Step 0, otherwise leave blank)
   Task execution role: ecsTaskExecutionRole (REQUIRED - select the role from Step 0)
   ```

5. **Storage (optional):**
   - Leave default unless you need ephemeral storage

6. **Monitoring and logging:**
   - Leave defaults

7. **Tags (optional):**
   ```
   Environment: production
   ```

8. Click **Create**

## Via JSON (Alternative Method):

Create a file `task-definition.json`:

```json
{
  "family": "my-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "my-app-container",
      "image": "YOUR_ECR_URI:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:my-app-secrets-xxxxx:DATABASE_PASSWORD::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Then register it:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

## Verify:

```bash
aws ecs describe-task-definition --task-definition my-app-task
```

**✅ SAVE THIS:**
```
Task Definition Family: my-app-task
Task Definition ARN: arn:aws:ecs:REGION:ACCOUNT:task-definition/my-app-task:1
Revision: 1
```

---

# STEP 8: CREATE ECS SERVICE

## Purpose
A service runs and maintains your tasks, ensuring they stay running.

## Steps:

1. **Go to ECS Console** → **Clusters** → Click **my-app-cluster**

2. Click **Services** tab → **Create**

3. **Environment:**
   ```
   Compute options: Launch type
   Launch type: FARGATE
   Platform version: LATEST
   ```

4. **Deployment configuration:**
   
   **Application type:**
   ```
   Service
   ```

   **Family:**
   ```
   my-app-task (select your task definition)
   Revision: 1 (LATEST) or specific revision
   ```

   **Service name:**
   ```
   my-app-service
   ```

   **Desired tasks:**
   ```
   1 (start with 1, you can scale later)
   ```

   **Deployment options:**
   ```
   Deployment type: Rolling update
   Min running tasks: 100%
   Max running tasks: 200%
   ```

5. **Networking:**

   **VPC:**
   ```
   Select your VPC: my-app-vpc (from Step 1)
   ```

   **Subnets:**
   ```
   ✅ Select both PUBLIC subnets (not private!)
   ```
   ⚠️ **Important:** For internet-facing apps, use PUBLIC subnets

   **Security group:**
   ```
   Use an existing security group
   ✅ Select your security group from Step 2
   ```

   **Public IP:**
   ```
   ✅ ENABLED (critical for public access!)
   ```

6. **Load balancing (Optional but Recommended for Production):**

   **Skip this for now** if you want to keep it simple. You can add a load balancer later.
   
   OR create one:
   ```
   Load balancer type: Application Load Balancer
   Load balancer name: my-app-alb
   Target group: Create new target group
   Target group name: my-app-tg
   Health check path: / (or /health if you have one)
   Health check grace period: 60 seconds
   ```

7. **Service auto scaling (Optional):**
   ```
   Skip for now - you can enable this later
   ```

8. **Tags (Optional):**
   ```
   Environment: production
   ```

9. Click **Create**

10. **Wait for service to start** (~2-3 minutes)

## Verify:

```bash
# Check service status
aws ecs describe-services --cluster my-app-cluster --services my-app-service

# List tasks
aws ecs list-tasks --cluster my-app-cluster --service-name my-app-service

# Describe task to get public IP
aws ecs describe-tasks --cluster my-app-cluster --tasks TASK_ARN
```

**✅ SAVE THIS:**
```
Service Name: my-app-service
Service ARN: arn:aws:ecs:REGION:ACCOUNT:service/my-app-cluster/my-app-service
```

---

# STEP 9: ACCESS YOUR APPLICATION

## Get Public IP:

### Method 1: AWS Console

1. **ECS** → **Clusters** → **my-app-cluster** → **Services**
2. Click **my-app-service**
3. Click **Tasks** tab
4. Click on the running task
5. In **Configuration** section → Find **Public IP**

### Method 2: AWS CLI

```bash
# Get task ARN
TASK_ARN=$(aws ecs list-tasks --cluster my-app-cluster --service-name my-app-service --query 'taskArns[0]' --output text)

# Get network interface ID
ENI_ID=$(aws ecs describe-tasks --cluster my-app-cluster --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)

# Get public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

echo "Your application is running at: http://$PUBLIC_IP:YOUR_PORT"
```

## Test Your Application:

Open in browser:
```
http://YOUR_PUBLIC_IP:YOUR_APP_PORT
```

Example: `http://54.123.45.67:3000`

## Check Logs:

### Via AWS Console:
1. **CloudWatch** → **Log groups** → **/ecs/my-app**
2. Click on latest log stream
3. View your application logs

### Via AWS CLI:
```bash
# Tail logs (live)
aws logs tail /ecs/my-app --follow

# View specific log stream
aws logs tail /ecs/my-app --follow --format short
```

**✅ VERIFY:**
```
[ ] Application is accessible via public IP
[ ] Application loads correctly
[ ] No errors in CloudWatch logs
[ ] Task status shows RUNNING
[ ] Service shows 1/1 tasks running
```

---

# STEP 10: VS CODE SETUP FOR EASY DEPLOYMENT

## Install Extensions:

1. Open VS Code
2. Install these extensions:
   - **AWS Toolkit** (by Amazon Web Services)
   - **Docker** (by Microsoft)

## Configure AWS Credentials:

Your credentials are already configured if you ran `aws configure` earlier. Verify:

```bash
aws configure list
cat ~/.aws/credentials
```

## Create Deployment Tasks:

1. In your project root, create `.vscode` folder if it doesn't exist
2. Create `.vscode/tasks.json` with this content:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "1️⃣ Build Docker Image",
      "type": "shell",
      "command": "docker build -t my-app-repo .",
      "problemMatcher": []
    },
    {
      "label": "2️⃣ Login to ECR",
      "type": "shell",
      "command": "/bin/bash",
      "args": [
        "-c",
        "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI"
      ],
      "problemMatcher": []
    },
    {
      "label": "3️⃣ Tag and Push to ECR",
      "type": "shell",
      "command": "/bin/bash",
      "args": [
        "-c",
        "docker tag my-app-repo:latest YOUR_ECR_URI:latest && docker push YOUR_ECR_URI:latest"
      ],
      "dependsOn": ["1️⃣ Build Docker Image", "2️⃣ Login to ECR"],
      "problemMatcher": []
    },
    {
      "label": "4️⃣ Deploy to ECS",
      "type": "shell",
      "command": "aws",
      "args": [
        "ecs",
        "update-service",
        "--cluster",
        "my-app-cluster",
        "--service",
        "my-app-service",
        "--force-new-deployment",
        "--region",
        "us-east-1"
      ],
      "dependsOn": ["3️⃣ Tag and Push to ECR"],
      "problemMatcher": []
    },
    {
      "label": "🚀 Full Deploy",
      "dependsOrder": "sequence",
      "dependsOn": [
        "1️⃣ Build Docker Image",
        "2️⃣ Login to ECR",
        "3️⃣ Tag and Push to ECR",
        "4️⃣ Deploy to ECS"
      ],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "📝 View Logs",
      "type": "shell",
      "command": "aws logs tail /ecs/my-app --follow",
      "problemMatcher": [],
      "isBackground": true
    }
  ]
}
```

3. **Update these values in tasks.json:**
   - Replace `YOUR_ECR_URI` with your actual ECR repository URI
   - Replace `us-east-1` with your region if different
   - Replace `my-app-cluster` and `my-app-service` if you used different names

## How to Use VS Code Tasks:

### Deploy from VS Code:
1. Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. Select **🚀 Full Deploy**
3. Watch the deployment in the terminal

### View Logs from VS Code:
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: **Tasks: Run Task**
3. Select: **📝 View Logs**

---

# DEPLOYMENT SCRIPT (ALTERNATIVE TO VS CODE)

Create a file `deploy.sh` in your project root:

```bash
#!/bin/bash
set -e

# Configuration - UPDATE THESE VALUES
AWS_REGION="us-east-1"
ECR_REPOSITORY_URI="123456789.dkr.ecr.us-east-1.amazonaws.com/my-app-repo"
ECS_CLUSTER="my-app-cluster"
ECS_SERVICE="my-app-service"
IMAGE_TAG="${1:-latest}"

echo "🔨 Building Docker image..."
docker build -t my-app-repo:$IMAGE_TAG .

echo "🔑 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

echo "🏷️  Tagging image..."
docker tag my-app-repo:$IMAGE_TAG $ECR_REPOSITORY_URI:$IMAGE_TAG

echo "⬆️  Pushing to ECR..."
docker push $ECR_REPOSITORY_URI:$IMAGE_TAG

echo "🚀 Deploying to ECS..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

echo "✅ Deployment initiated!"
echo "Monitor: aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
# Or with a tag:
./deploy.sh v1.0.0
```

---

# TROUBLESHOOTING GUIDE

## Task Won't Start / Stuck in PENDING

**Check 1: Task Execution Role**
```bash
aws iam get-role --role-name ecsTaskExecutionRole
```
Solution: Make sure role exists and has correct policies

**Check 2: Security Group**
- Make sure security group allows traffic on your app port
- Make sure outbound rules allow all traffic

**Check 3: Subnets**
- Make sure you selected PUBLIC subnets (not private)
- Make sure "Auto-assign public IP" is ENABLED

**Check 4: View Task Stopped Reason**
```bash
# Get stopped tasks
aws ecs list-tasks --cluster my-app-cluster --desired-status STOPPED

# Describe to see why it stopped
aws ecs describe-tasks --cluster my-app-cluster --tasks TASK_ARN
```

---

## Can't Pull Image from ECR

**Error:** `CannotPullContainerError`

**Solution:**
```bash
# Verify image exists
aws ecr list-images --repository-name my-app-repo

# Check task execution role has ECR permissions
aws iam list-attached-role-policies --role-name ecsTaskExecutionRole
```

Should have: `AmazonEC2ContainerRegistryReadOnly`

---

## Can't Access Application

**Check 1: Task is Running**
```bash
aws ecs describe-services --cluster my-app-cluster --services my-app-service --query 'services[0].{Running:runningCount,Desired:desiredCount}'
```

**Check 2: Get Public IP**
```bash
# Use the command from Step 9 to get public IP
```

**Check 3: Security Group**
- Inbound rules must allow port YOUR_APP_PORT from 0.0.0.0/0

**Check 4: Application Port**
- Make sure your app is listening on the correct port
- Check CloudWatch logs for startup errors

---

## Secrets Not Loading

**Error:** Application can't read environment variables from Secrets Manager

**Check Secret ARN Format:**
```
Wrong: arn:aws:secretsmanager:us-east-1:123:secret:my-app-secrets-AbCdEf
Right: arn:aws:secretsmanager:us-east-1:123:secret:my-app-secrets-AbCdEf:DATABASE_PASSWORD::
```

**Check Task Execution Role:**
```bash
aws iam list-role-policies --role-name ecsTaskExecutionRole
```
Should have inline policy for Secrets Manager access.

---

## No Logs in CloudWatch

**Check 1: Log Group Exists**
```bash
aws logs describe-log-groups --log-group-name-prefix /ecs/my-app
```

**Check 2: Task Definition Log Configuration**
```bash
aws ecs describe-task-definition --task-definition my-app-task --query 'taskDefinition.containerDefinitions[0].logConfiguration'
```

Should show awslogs configuration.

**Check 3: Task Execution Role**
Must have `AmazonECSTaskExecutionRolePolicy` which includes CloudWatch Logs permissions.

---

# USEFUL COMMANDS

## Service Management

```bash
# View service status
aws ecs describe-services --cluster my-app-cluster --services my-app-service

# List tasks
aws ecs list-tasks --cluster my-app-cluster

# Describe task
aws ecs describe-tasks --cluster my-app-cluster --tasks TASK_ARN

# Force new deployment (after pushing new image)
aws ecs update-service --cluster my-app-cluster --service my-app-service --force-new-deployment

# Scale service
aws ecs update-service --cluster my-app-cluster --service my-app-service --desired-count 2

# Stop service (set to 0 tasks)
aws ecs update-service --cluster my-app-cluster --service my-app-service --desired-count 0
```

## Logging

```bash
# Tail logs (live)
aws logs tail /ecs/my-app --follow

# View specific time range
aws logs tail /ecs/my-app --since 1h

# Filter logs
aws logs tail /ecs/my-app --follow --filter-pattern "ERROR"
```

## ECR Management

```bash
# List images
aws ecr describe-images --repository-name my-app-repo

# Delete image
aws ecr batch-delete-image --repository-name my-app-repo --image-ids imageTag=old-tag

# Get repository URI
aws ecr describe-repositories --repository-names my-app-repo --query 'repositories[0].repositoryUri' --output text
```

## Task Definition

```bash
# List all revisions
aws ecs list-task-definitions --family-prefix my-app-task

# Describe specific revision
aws ecs describe-task-definition --task-definition my-app-task:2

# Deregister old revision
aws ecs deregister-task-definition --task-definition my-app-task:1
```

---

# DAILY WORKFLOW

## Making Changes and Deploying:

1. **Make code changes locally**

2. **Test locally:**
   ```bash
   docker build -t my-app .
   docker run -p 3000:3000 my-app
   # Test at http://localhost:3000
   ```

3. **Deploy to AWS:**
   
   **Option A - VS Code:**
   ```
   Press Ctrl+Shift+B → Select "🚀 Full Deploy"
   ```
   
   **Option B - Script:**
   ```bash
   ./deploy.sh
   ```
   
   **Option C - Manual:**
   ```bash
   # Build
   docker build -t my-app-repo .
   
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
   
   # Tag and push
   docker tag my-app-repo:latest YOUR_ECR_URI:latest
   docker push YOUR_ECR_URI:latest
   
   # Deploy
   aws ecs update-service --cluster my-app-cluster --service my-app-service --force-new-deployment
   ```

4. **Monitor deployment:**
   ```bash
   # Watch service update
   aws ecs describe-services --cluster my-app-cluster --services my-app-service --query 'services[0].events[0:5]'
   
   # Watch logs
   aws logs tail /ecs/my-app --follow
   ```

5. **Verify:**
   - Check app at `http://PUBLIC_IP:PORT`
   - Check logs for errors

---

# ROLLBACK

If deployment has issues, rollback to previous version:

```bash
# List task definition revisions
aws ecs list-task-definitions --family-prefix my-app-task

# Update service to previous revision
aws ecs update-service \
  --cluster my-app-cluster \
  --service my-app-service \
  --task-definition my-app-task:PREVIOUS_REVISION_NUMBER
```

---

# CLEANUP (When you want to delete everything)

**⚠️ WARNING: This will delete all resources and you'll lose your deployment!**

```bash
# 1. Delete service (must be done first)
aws ecs update-service --cluster my-app-cluster --service my-app-service --desired-count 0
aws ecs delete-service --cluster my-app-cluster --service my-app-service --force

# 2. Delete cluster
aws ecs delete-cluster --cluster my-app-cluster

# 3. Delete ECR images and repository
aws ecr delete-repository --repository-name my-app-repo --force

# 4. Delete log group
aws logs delete-log-group --log-group-name /ecs/my-app

# 5. Delete secret
aws secretsmanager delete-secret --secret-id my-app-secrets --force-delete-without-recovery

# 6. Delete VPC (from console - it's complex via CLI)

# 7. Delete IAM roles (from console - need to detach policies first)
```

---

# SUMMARY

You now have:
- ✅ IAM roles for ECS tasks
- ✅ VPC with public subnets
- ✅ Security group allowing traffic
- ✅ Secrets stored securely
- ✅ Docker images in ECR
- ✅ CloudWatch for logging
- ✅ ECS cluster running your app
- ✅ Automated deployment from VS Code

## Your Application URLs:
```
Application: http://YOUR_PUBLIC_IP:YOUR_PORT
Logs: CloudWatch → /ecs/my-app
ECR: AWS Console → ECR → my-app-repo
Service: AWS Console → ECS → my-app-cluster → my-app-service
```

## Next Steps (Optional):
1. Set up custom domain with Route 53
2. Add SSL certificate with ACM
3. Configure Application Load Balancer
4. Enable auto-scaling
5. Set up CI/CD with GitHub Actions
6. Configure CloudWatch alarms

---

**🎉 Congratulations! Your application is now deployed on AWS ECS Fargate!**
