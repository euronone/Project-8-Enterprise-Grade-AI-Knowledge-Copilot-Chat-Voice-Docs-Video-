# KnowledgeForge — AWS ECS Fargate Infrastructure

## Architecture Overview

```
Internet
    │
    ▼
[Application Load Balancer]  ← one DNS name shared with users
    │                │
    │ Port 80        │ Port 8000
    ▼                ▼
[Frontend ECS]   [Backend ECS]   ← Fargate tasks in private subnets
 (Next.js :3000)  (FastAPI :8000)
                      │
              ┌───────┴───────┐
              ▼               ▼
         [RDS Postgres]  [ElastiCache Redis]
         (private subnet) (private subnet)
              │
              ▼
         [S3 Bucket]  ← file uploads
         [Secrets Manager]  ← all secrets
         [CloudWatch]       ← logs
```

## AWS Services Created

| Service | Purpose | Cost Estimate |
|---------|---------|---------------|
| ECS Fargate (×2) | Run containers | ~$15-30/mo |
| ALB | Load balancer + public URL | ~$18/mo |
| RDS `db.t3.micro` | PostgreSQL database | ~$15/mo (free tier 1yr) |
| ElastiCache `cache.t3.micro` | Redis cache | ~$12/mo |
| ECR (×2 repos) | Docker image registry | ~$1/mo |
| S3 | File uploads | ~$1/mo |
| Secrets Manager | Store secrets | ~$0.80/mo |
| CloudWatch | Logs | ~$2/mo |
| NAT Gateway | Private subnet internet | ~$32/mo |
| **Total** | | **~$96-116/mo** |

> **Cost tip:** The NAT Gateway (~$32/mo) is the most expensive fixed cost.
> For a dev environment, you can assign public IPs to ECS tasks instead (edit `assign_public_ip = true` in `ecs.tf`).

---

## Prerequisites

Install these tools:

```bash
# 1. Terraform (>= 1.5)
# Download from: https://developer.hashicorp.com/terraform/downloads

# 2. AWS CLI
# Windows: https://aws.amazon.com/cli/
aws --version

# 3. Docker Desktop
docker --version

# 4. Git
git --version
```

---

## Setup Instructions

### Step 1 — AWS IAM Credentials

1. Log in to **AWS Console** → **IAM** → **Users** → **Create user**
2. User name: `knowledgeforge-deploy`
3. Attach policy: **AdministratorAccess** (or use the least-privilege policy below)
4. Create **Access Key** (CLI type)
5. Download or copy the Access Key ID and Secret Access Key

Configure AWS CLI:
```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)
```

OR use the `.env` file approach:
```bash
cp infrastructure/.env.example infrastructure/.env
# Edit infrastructure/.env with your credentials
source infrastructure/.env
```

### Step 2 — Configure Terraform Variables

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region        = "us-east-1"
db_password       = "YourStrongPassword123!"    # min 8 chars
secret_key        = "run: openssl rand -hex 32" # JWT secret
nextauth_secret   = "run: openssl rand -hex 32" # different from above
anthropic_api_key = "sk-ant-..."                # from console.anthropic.com
openai_api_key    = "sk-..."                    # optional
tavily_api_key    = ""                          # optional
```

To generate secrets:
```bash
# On Linux/Mac:
openssl rand -hex 32

# On Windows PowerShell:
[System.Web.Security.Membership]::GeneratePassword(64, 0)
```

### Step 3 — Run the Deploy Script

```bash
# From the project root:
bash infrastructure/deploy.sh
```

This script will:
1. Run `terraform apply` — creates all AWS infrastructure (~10-15 min)
2. Build the backend Docker image and push to ECR
3. Build the frontend Docker image (with ALB URL baked in) and push to ECR
4. Force ECS service updates to pull new images
5. Wait for services to stabilize and print the app URL

### Step 4 — Share the App URL

After deployment, the script prints:
```
🌐  App URL (share this):  http://your-alb-name.us-east-1.elb.amazonaws.com
```

Share this URL with your users.

---

## GitHub Actions (Automated CI/CD)

For automatic deployment on every push to `main`:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `AWS_ACCESS_KEY_ID` — your IAM access key
   - `AWS_SECRET_ACCESS_KEY` — your IAM secret key

3. Push to `main` branch → deployment triggers automatically

> **Note:** The GitHub Actions workflow assumes infrastructure is already created by Terraform. Run the deploy script manually at least once first.

---

## Updating the App

After the initial setup, to deploy code changes:

```bash
# Rebuild and push images, then update ECS
bash infrastructure/deploy.sh --skip-terraform
```

Or just push to `main` and let GitHub Actions handle it.

---

## Useful Commands

```bash
# View backend logs (live)
aws logs tail /ecs/knowledgeforge/backend --follow --region us-east-1

# View frontend logs (live)
aws logs tail /ecs/knowledgeforge/frontend --follow --region us-east-1

# List running ECS tasks
aws ecs list-tasks --cluster knowledgeforge-cluster --region us-east-1

# Describe a task (for debugging)
aws ecs describe-tasks --cluster knowledgeforge-cluster --tasks <task-arn> --region us-east-1

# SSH into a running container (ECS Exec)
aws ecs execute-command \
  --cluster knowledgeforge-cluster \
  --task <task-arn> \
  --container backend \
  --interactive --command "/bin/bash" \
  --region us-east-1

# Destroy all infrastructure (WARNING: deletes everything including data)
cd infrastructure/terraform && terraform destroy
```

---

## Troubleshooting

**Tasks fail to start:**
- Check CloudWatch logs: AWS Console → CloudWatch → Log Groups → `/ecs/knowledgeforge/backend`
- Verify secrets are accessible: check IAM execution role
- Ensure ECR images exist and have the `latest` tag

**Health checks failing:**
- Backend: ensure `/health` endpoint returns 200
- Frontend: ensure `/api/health` returns 200
- Increase `startPeriod` in ECS health check if app takes longer to boot

**Can't connect to RDS:**
- Check security groups — backend SG must be in RDS ingress rules
- Verify DATABASE_URL in Secrets Manager has correct endpoint

**Frontend shows blank page:**
- Check that NEXT_PUBLIC_API_URL was baked in at build time
- Verify the backend is healthy and reachable on port 8000
- Check frontend CloudWatch logs for errors

**NAT Gateway cost concern:**
- For dev, set `assign_public_ip = true` in `ecs.tf` and remove the NAT Gateway resource from `vpc.tf`

---

## Tear Down

To avoid ongoing AWS charges:
```bash
cd infrastructure/terraform
terraform destroy
```

This deletes all created resources. RDS data will be lost (unless you take a manual snapshot first).
