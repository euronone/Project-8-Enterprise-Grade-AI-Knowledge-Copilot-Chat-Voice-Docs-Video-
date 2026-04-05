#!/usr/bin/env bash
# ============================================================
# KnowledgeForge — One-Time AWS Infrastructure Setup
#
# Run ONCE from the repo root (Git Bash on Windows):
#   bash setup-aws.sh
#
# Prerequisites:
#   1. AWS CLI installed  (https://aws.amazon.com/cli/)
#   2. .env file filled in with your AWS_ACCESS_KEY_ID &
#      AWS_SECRET_ACCESS_KEY
#   3. Docker running (needed to push initial placeholder image)
# ============================================================
set -euo pipefail

# Fix: prevent Git Bash on Windows from converting /path → C:/Program Files/Git/path
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# ── Load .env ────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "ERROR: .env not found. Fill it in first then re-run."
  exit 1
fi
# shellcheck disable=SC2046
export $(grep -v '^#' .env | grep -v '^$' | sed 's/[[:space:]]*$//' | xargs)

REGION="${AWS_REGION:-us-east-1}"
ACCOUNT="${AWS_ACCOUNT_ID:-993750298110}"
PROJECT="knowledgeforge"
ECR_BASE="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"

export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION="$REGION"

echo "============================================================"
echo "  KnowledgeForge — AWS Infrastructure Setup"
echo "  Account : $ACCOUNT"
echo "  Region  : $REGION"
echo "============================================================"
echo ""

# ── Helper ───────────────────────────────────────────────────
aws_exists() { [ -n "$1" ] && [ "$1" != "None" ] && [ "$1" != "null" ]; }

# ── 1. ECR Repositories ──────────────────────────────────────
echo "[1/9] ECR repositories..."
for repo in "${PROJECT}-backend" "${PROJECT}-frontend"; do
  aws ecr describe-repositories --repository-names "$repo" \
    --region "$REGION" >/dev/null 2>&1 \
  || aws ecr create-repository \
       --repository-name "$repo" \
       --region "$REGION" \
       --image-scanning-configuration scanOnPush=true \
       --output text --query 'repository.repositoryUri'
  echo "  ✓ $repo"
done

# Push a placeholder so ECS can start even before the first real CI build
echo "  → Pushing placeholder images to ECR..."
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$ECR_BASE" 2>/dev/null

for svc in backend frontend; do
  REPO="${ECR_BASE}/${PROJECT}-${svc}"
  # Only push if 'latest' tag doesn't exist yet
  if ! aws ecr describe-images \
       --repository-name "${PROJECT}-${svc}" \
       --image-ids imageTag=latest \
       --region "$REGION" >/dev/null 2>&1; then
    docker pull --platform linux/amd64 nginx:alpine >/dev/null 2>&1
    docker tag nginx:alpine "${REPO}:latest"
    docker push "${REPO}:latest" >/dev/null
    echo "  ✓ Placeholder pushed → ${svc}"
  else
    echo "  ✓ Image already exists → ${svc} [SKIP]"
  fi
done

# ── 2. ECS Cluster ───────────────────────────────────────────
echo ""
echo "[2/9] ECS cluster..."
aws ecs create-cluster \
  --cluster-name "${PROJECT}-cluster" \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE_SPOT,weight=4 \
    capacityProvider=FARGATE,weight=1 \
  --region "$REGION" \
  --output text --query 'cluster.clusterArn' >/dev/null 2>&1 \
|| echo "  (cluster already exists)"
echo "  ✓ ${PROJECT}-cluster"

# ── 3. IAM Task Execution Role ───────────────────────────────
echo ""
echo "[3/9] IAM execution role..."
ROLE="${PROJECT}-ecs-execution-role"
ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE}"

aws iam get-role --role-name "$ROLE" >/dev/null 2>&1 || {
  aws iam create-role \
    --role-name "$ROLE" \
    --assume-role-policy-document '{
      "Version":"2012-10-17",
      "Statement":[{
        "Effect":"Allow",
        "Principal":{"Service":"ecs-tasks.amazonaws.com"},
        "Action":"sts:AssumeRole"
      }]
    }' \
    --output text --query 'Role.Arn' >/dev/null

  aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}
echo "  ✓ $ROLE"

# ── 4. CloudWatch Log Groups ─────────────────────────────────
echo ""
echo "[4/9] CloudWatch log groups..."
for svc in backend frontend; do
  aws logs create-log-group \
    --log-group-name "/ecs/${PROJECT}-${svc}" \
    --region "$REGION" 2>/dev/null || true
  echo "  ✓ /ecs/${PROJECT}-${svc}"
done

# ── 5. Default VPC & Subnets ─────────────────────────────────
echo ""
echo "[5/9] VPC & subnets..."
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query 'Vpcs[0].VpcId' \
  --output text --region "$REGION")

SUBNETS_RAW=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=defaultForAz,Values=true" \
  --query 'Subnets[*].SubnetId' \
  --output text --region "$REGION")
SUBNETS=$(echo "$SUBNETS_RAW" | tr '\t' ',')
SUBNET_LIST=$(echo "$SUBNETS_RAW" | tr '\t' ' ')

echo "  ✓ VPC: $VPC_ID"
echo "  ✓ Subnets: $SUBNETS"

# ── 6. Security Groups ───────────────────────────────────────
echo ""
echo "[6/9] Security groups..."

# ALB SG
ALB_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=${PROJECT}-alb-sg" \
            "Name=vpc-id,Values=${VPC_ID}" \
  --query 'SecurityGroups[0].GroupId' \
  --output text --region "$REGION" 2>/dev/null || echo "")

if ! aws_exists "$ALB_SG"; then
  ALB_SG=$(aws ec2 create-security-group \
    --group-name "${PROJECT}-alb-sg" \
    --description "KnowledgeForge ALB" \
    --vpc-id "$VPC_ID" \
    --query 'GroupId' --output text --region "$REGION")
  aws ec2 authorize-security-group-ingress \
    --group-id "$ALB_SG" --region "$REGION" \
    --ip-permissions \
      'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \
      'IpProtocol=tcp,FromPort=8000,ToPort=8000,IpRanges=[{CidrIp=0.0.0.0/0}]' \
    >/dev/null
fi
echo "  ✓ ALB SG: $ALB_SG"

# ECS SG
ECS_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=${PROJECT}-ecs-sg" \
            "Name=vpc-id,Values=${VPC_ID}" \
  --query 'SecurityGroups[0].GroupId' \
  --output text --region "$REGION" 2>/dev/null || echo "")

if ! aws_exists "$ECS_SG"; then
  ECS_SG=$(aws ec2 create-security-group \
    --group-name "${PROJECT}-ecs-sg" \
    --description "KnowledgeForge ECS Tasks" \
    --vpc-id "$VPC_ID" \
    --query 'GroupId' --output text --region "$REGION")
  aws ec2 authorize-security-group-ingress \
    --group-id "$ECS_SG" --region "$REGION" \
    --ip-permissions \
      'IpProtocol=tcp,FromPort=3000,ToPort=3000,IpRanges=[{CidrIp=0.0.0.0/0}]' \
      'IpProtocol=tcp,FromPort=8000,ToPort=8000,IpRanges=[{CidrIp=0.0.0.0/0}]' \
      'IpProtocol=tcp,FromPort=6379,ToPort=6379,IpRanges=[{CidrIp=10.0.0.0/8}]' \
    >/dev/null
fi
echo "  ✓ ECS SG: $ECS_SG"

# ── 7. Application Load Balancer ─────────────────────────────
echo ""
echo "[7/9] Application Load Balancer..."

ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names "${PROJECT}-alb" \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text --region "$REGION" 2>/dev/null || echo "")

if ! aws_exists "$ALB_ARN"; then
  ALB_ARN=$(aws elbv2 create-load-balancer \
    --name "${PROJECT}-alb" \
    --subnets $SUBNET_LIST \
    --security-groups "$ALB_SG" \
    --scheme internet-facing \
    --type application \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text --region "$REGION")
fi

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns "$ALB_ARN" \
  --query 'LoadBalancers[0].DNSName' \
  --output text --region "$REGION")
echo "  ✓ ALB DNS: $ALB_DNS"

# ── 8. Target Groups + Listeners ─────────────────────────────
echo ""
echo "[8/9] Target groups & listeners..."

create_tg() {
  local name="$1" port="$2" hc_path="$3"
  local arn
  arn=$(aws elbv2 describe-target-groups --names "$name" \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text --region "$REGION" 2>/dev/null || echo "")
  if ! aws_exists "$arn"; then
    arn=$(aws elbv2 create-target-group \
      --name "$name" \
      --protocol HTTP --port "$port" \
      --vpc-id "$VPC_ID" --target-type ip \
      --health-check-path "$hc_path" \
      --health-check-interval-seconds 30 \
      --healthy-threshold-count 2 \
      --unhealthy-threshold-count 3 \
      --query 'TargetGroups[0].TargetGroupArn' \
      --output text --region "$REGION")
  fi
  echo "$arn"
}

FE_TG=$(create_tg "${PROJECT}-frontend-tg" 3000 "/")
BE_TG=$(create_tg "${PROJECT}-backend-tg"  8000 "/health")
echo "  ✓ Frontend TG"
echo "  ✓ Backend TG"

# Listeners (idempotent)
create_listener() {
  local alb_arn="$1" port="$2" tg_arn="$3"
  local existing
  existing=$(aws elbv2 describe-listeners \
    --load-balancer-arn "$alb_arn" \
    --query "Listeners[?Port==\`${port}\`].ListenerArn" \
    --output text --region "$REGION" 2>/dev/null || echo "")
  if ! aws_exists "$existing"; then
    aws elbv2 create-listener \
      --load-balancer-arn "$alb_arn" \
      --protocol HTTP --port "$port" \
      --default-actions "Type=forward,TargetGroupArn=${tg_arn}" \
      --output text --query 'Listeners[0].ListenerArn' \
      --region "$REGION" >/dev/null
  fi
}
create_listener "$ALB_ARN" 80   "$FE_TG"
create_listener "$ALB_ARN" 8000 "$BE_TG"
echo "  ✓ Listener :80  → frontend"
echo "  ✓ Listener :8000 → backend"

# ── 9. ECS Task Definitions + Services ───────────────────────
echo ""
echo "[9/9] Task definitions & ECS services..."

# ── Backend task definition ──
python - <<PYEOF > ./kf-backend-task.json
import json, os

ACCOUNT = os.environ.get("ACCOUNT", "993750298110")
REGION  = os.environ.get("REGION", "us-east-1")
PROJECT = "knowledgeforge"
ECR_BASE = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com"
ALB_DNS  = os.environ.get("ALB_DNS", "")

task = {
    "family": f"{PROJECT}-backend",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "512",
    "memory": "1024",
    "executionRoleArn": f"arn:aws:iam::{ACCOUNT}:role/{PROJECT}-ecs-execution-role",
    "containerDefinitions": [
        {
            "name": "backend",
            "image": f"{ECR_BASE}/{PROJECT}-backend:latest",
            "portMappings": [{"containerPort": 8000, "protocol": "tcp"}],
            "essential": True,
            "environment": [
                {"name": "DATABASE_URL",     "value": os.environ.get("DATABASE_URL", "")},
                {"name": "DATABASE_SSL",     "value": "true"},
                {"name": "REDIS_URL",        "value": "redis://localhost:6379"},
                {"name": "SECRET_KEY",       "value": os.environ.get("SECRET_KEY", "change-me")},
                {"name": "ANTHROPIC_API_KEY","value": os.environ.get("ANTHROPIC_API_KEY", "")},
                {"name": "OPENAI_API_KEY",   "value": os.environ.get("OPENAI_API_KEY", "")},
                {"name": "TAVILY_API_KEY",   "value": os.environ.get("TAVILY_API_KEY", "")},
                {"name": "CORS_ORIGINS",     "value": f'["http://{ALB_DNS}","http://{ALB_DNS}:8000","http://localhost:3001"]'},
                {"name": "DEBUG",            "value": "false"},
                {"name": "UPLOAD_DIR",       "value": "uploads"},
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group":         f"/ecs/{PROJECT}-backend",
                    "awslogs-region":        REGION,
                    "awslogs-stream-prefix": "ecs",
                }
            },
            "healthCheck": {
                "command":     ["CMD-SHELL", "curl -sf http://localhost:8000/health || exit 1"],
                "interval":    30,
                "timeout":     10,
                "retries":     3,
                "startPeriod": 40,
            },
        },
        {
            "name": "redis",
            "image": "redis:7-alpine",
            "essential": False,
            "portMappings": [{"containerPort": 6379, "protocol": "tcp"}],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group":         f"/ecs/{PROJECT}-backend",
                    "awslogs-region":        REGION,
                    "awslogs-stream-prefix": "redis",
                }
            },
        },
    ],
}
print(json.dumps(task, indent=2))
PYEOF

export ACCOUNT REGION ALB_DNS
BACKEND_TASK_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://kf-backend-task.json \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text --region "$REGION")
echo "  ✓ Backend task: $BACKEND_TASK_ARN"

# ── Frontend task definition ──
python - <<PYEOF > ./kf-frontend-task.json
import json, os

ACCOUNT  = os.environ.get("ACCOUNT", "993750298110")
REGION   = os.environ.get("REGION", "us-east-1")
PROJECT  = "knowledgeforge"
ECR_BASE = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com"
ALB_DNS  = os.environ.get("ALB_DNS", "")

task = {
    "family": f"{PROJECT}-frontend",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": f"arn:aws:iam::{ACCOUNT}:role/{PROJECT}-ecs-execution-role",
    "containerDefinitions": [
        {
            "name": "frontend",
            "image": f"{ECR_BASE}/{PROJECT}-frontend:latest",
            "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
            "essential": True,
            "environment": [
                {"name": "NEXT_PUBLIC_API_URL", "value": f"http://{ALB_DNS}:8000"},
                {"name": "NEXT_PUBLIC_WS_URL",  "value": f"ws://{ALB_DNS}:8000"},
                {"name": "NEXT_PUBLIC_APP_URL", "value": f"http://{ALB_DNS}"},
                {"name": "NEXTAUTH_URL",         "value": f"http://{ALB_DNS}"},
                {"name": "NEXTAUTH_SECRET",      "value": os.environ.get("NEXTAUTH_SECRET", "change-me")},
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group":         f"/ecs/{PROJECT}-frontend",
                    "awslogs-region":        REGION,
                    "awslogs-stream-prefix": "ecs",
                }
            },
            "healthCheck": {
                "command":     ["CMD-SHELL", "wget -qO- http://localhost:3000 > /dev/null || exit 1"],
                "interval":    30,
                "timeout":     15,
                "retries":     3,
                "startPeriod": 60,
            },
        }
    ],
}
print(json.dumps(task, indent=2))
PYEOF

FRONTEND_TASK_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://kf-frontend-task.json \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text --region "$REGION")
echo "  ✓ Frontend task: $FRONTEND_TASK_ARN"

# ── ECS Services ─────────────────────────────────────────────
create_or_skip_service() {
  local name="$1" task_arn="$2" tg_arn="$3" container="$4" port="$5"

  local status
  status=$(aws ecs describe-services \
    --cluster "${PROJECT}-cluster" \
    --services "$name" \
    --query 'services[0].status' \
    --output text --region "$REGION" 2>/dev/null || echo "")

  if [ "$status" = "ACTIVE" ]; then
    echo "  ✓ $name already exists [SKIP]"
  else
    aws ecs create-service \
      --cluster "${PROJECT}-cluster" \
      --service-name "$name" \
      --task-definition "$task_arn" \
      --desired-count 1 \
      --launch-type FARGATE \
      --network-configuration \
        "awsvpcConfiguration={subnets=[${SUBNETS}],securityGroups=[${ECS_SG}],assignPublicIp=ENABLED}" \
      --load-balancers \
        "targetGroupArn=${tg_arn},containerName=${container},containerPort=${port}" \
      --region "$REGION" \
      --output text --query 'service.serviceArn' >/dev/null
    echo "  ✓ $name created"
  fi
}

create_or_skip_service "${PROJECT}-backend-svc"  "$BACKEND_TASK_ARN"  "$BE_TG" "backend"  8000
create_or_skip_service "${PROJECT}-frontend-svc" "$FRONTEND_TASK_ARN" "$FE_TG" "frontend" 3000

# ── Save outputs ─────────────────────────────────────────────
cat > .aws-outputs.txt <<OUTEOF
ALB_DNS=${ALB_DNS}
FRONTEND_URL=http://${ALB_DNS}
BACKEND_URL=http://${ALB_DNS}:8000
API_DOCS=http://${ALB_DNS}:8000/docs
ECS_CLUSTER=${PROJECT}-cluster
BACKEND_SERVICE=${PROJECT}-backend-svc
FRONTEND_SERVICE=${PROJECT}-frontend-svc
ECR_BACKEND=${ECR_BASE}/${PROJECT}-backend
ECR_FRONTEND=${ECR_BASE}/${PROJECT}-frontend
OUTEOF

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  Infrastructure ready!"
echo ""
echo "  Frontend : http://${ALB_DNS}"
echo "  Backend  : http://${ALB_DNS}:8000"
echo "  API Docs : http://${ALB_DNS}:8000/docs"
echo ""
echo "  NOTE: ECS is starting containers now (~3-5 min)."
echo "        The URL will be live once health checks pass."
echo ""
echo "  NEXT STEPS:"
echo "  1. Add GitHub Secrets (repo → Settings → Secrets → Actions):"
echo "     AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,"
echo "     DATABASE_URL, SECRET_KEY, OPENAI_API_KEY,"
echo "     TAVILY_API_KEY, ANTHROPIC_API_KEY, NEXTAUTH_SECRET"
echo ""
echo "  2. Push code to feature/development → pipeline auto-deploys"
echo ""
echo "  Outputs saved to .aws-outputs.txt"
echo "============================================================"
