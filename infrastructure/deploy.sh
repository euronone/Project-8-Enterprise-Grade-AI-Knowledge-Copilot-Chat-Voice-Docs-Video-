#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Build, push, and deploy KnowledgeForge to AWS ECS Fargate
#
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Docker running
#   - Terraform installed
#   - infrastructure/terraform/terraform.tfvars filled in
#
# Usage:
#   ./infrastructure/deploy.sh [--skip-terraform] [--skip-build]
#
# Options:
#   --skip-terraform   Skip terraform apply (use if infra already exists)
#   --skip-build       Skip Docker build/push (use for config-only updates)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TF_DIR="${SCRIPT_DIR}/terraform"

SKIP_TERRAFORM=false
SKIP_BUILD=false

for arg in "$@"; do
  case $arg in
    --skip-terraform) SKIP_TERRAFORM=true ;;
    --skip-build)     SKIP_BUILD=true ;;
  esac
done

echo "============================================="
echo "  KnowledgeForge — AWS ECS Fargate Deploy"
echo "============================================="

# ── Step 1: Terraform Apply ────────────────────────────────────────────────────
if [ "$SKIP_TERRAFORM" = false ]; then
  echo ""
  echo "▶ Step 1/4: Provisioning AWS infrastructure with Terraform..."

  cd "${TF_DIR}"

  if [ ! -f "terraform.tfvars" ]; then
    echo "ERROR: terraform.tfvars not found!"
    echo "  Copy terraform.tfvars.example → terraform.tfvars and fill in your values."
    exit 1
  fi

  terraform init
  terraform plan -out=tfplan
  echo ""
  echo "Review the plan above. Press ENTER to apply or Ctrl+C to cancel."
  read -r

  terraform apply tfplan
  rm -f tfplan
  echo "✓ Infrastructure provisioned."
else
  echo "⏭ Skipping Terraform (--skip-terraform)"
  cd "${TF_DIR}"
  terraform init -input=false > /dev/null 2>&1 || true
fi

# ── Step 2: Read Terraform Outputs ────────────────────────────────────────────
echo ""
echo "▶ Step 2/4: Reading infrastructure outputs..."

AWS_REGION=$(terraform output -raw aws_region)
AWS_ACCOUNT_ID=$(terraform output -raw aws_account_id)
ECR_BACKEND=$(terraform output -raw ecr_backend_url)
ECR_FRONTEND=$(terraform output -raw ecr_frontend_url)
ALB_DNS=$(terraform output -raw alb_dns_name | sed 's|http://||')
BACKEND_API_URL="http://${ALB_DNS}:8000"
FRONTEND_URL="http://${ALB_DNS}"
ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
BACKEND_SERVICE=$(terraform output -raw ecs_backend_service_name)
FRONTEND_SERVICE=$(terraform output -raw ecs_frontend_service_name)

echo "  ALB DNS:          ${ALB_DNS}"
echo "  Frontend URL:     ${FRONTEND_URL}"
echo "  Backend API URL:  ${BACKEND_API_URL}"
echo "  ECR Backend:      ${ECR_BACKEND}"
echo "  ECR Frontend:     ${ECR_FRONTEND}"

cd "${ROOT_DIR}"

# ── Step 3: Build and Push Docker Images ──────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  echo ""
  echo "▶ Step 3/4: Building and pushing Docker images to ECR..."

  # Authenticate Docker with ECR
  aws ecr get-login-password --region "${AWS_REGION}" | \
    docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

  # ── Build & Push Backend ──────────────────────────────────────────────────
  echo ""
  echo "  Building backend image..."
  docker build \
    --platform linux/amd64 \
    -t "${ECR_BACKEND}:latest" \
    -t "${ECR_BACKEND}:$(git rev-parse --short HEAD 2>/dev/null || echo 'local')" \
    "${ROOT_DIR}/backend"

  echo "  Pushing backend image to ECR..."
  docker push "${ECR_BACKEND}:latest"
  docker push "${ECR_BACKEND}:$(git rev-parse --short HEAD 2>/dev/null || echo 'local')"

  # ── Build & Push Frontend ─────────────────────────────────────────────────
  # IMPORTANT: NEXT_PUBLIC_* vars must be baked in at build time for Next.js
  echo ""
  echo "  Building frontend image (with API URL: ${BACKEND_API_URL})..."
  docker build \
    --platform linux/amd64 \
    --build-arg NEXT_PUBLIC_API_URL="${BACKEND_API_URL}" \
    --build-arg NEXT_PUBLIC_WS_URL="ws://${ALB_DNS}:8000" \
    --build-arg NEXT_PUBLIC_APP_URL="${FRONTEND_URL}" \
    -t "${ECR_FRONTEND}:latest" \
    -t "${ECR_FRONTEND}:$(git rev-parse --short HEAD 2>/dev/null || echo 'local')" \
    "${ROOT_DIR}/frontend"

  echo "  Pushing frontend image to ECR..."
  docker push "${ECR_FRONTEND}:latest"
  docker push "${ECR_FRONTEND}:$(git rev-parse --short HEAD 2>/dev/null || echo 'local')"

  echo "✓ Images built and pushed."
else
  echo "⏭ Skipping Docker build (--skip-build)"
fi

# ── Step 4: Force ECS Service Updates ─────────────────────────────────────────
echo ""
echo "▶ Step 4/4: Updating ECS services (forcing new deployment)..."

aws ecs update-service \
  --cluster "${ECS_CLUSTER}" \
  --service "${BACKEND_SERVICE}" \
  --force-new-deployment \
  --region "${AWS_REGION}" \
  --output text --query 'service.serviceArn' > /dev/null

echo "  ✓ Backend service update triggered."

aws ecs update-service \
  --cluster "${ECS_CLUSTER}" \
  --service "${FRONTEND_SERVICE}" \
  --force-new-deployment \
  --region "${AWS_REGION}" \
  --output text --query 'service.serviceArn' > /dev/null

echo "  ✓ Frontend service update triggered."

echo ""
echo "⏳ Waiting for services to stabilize (this may take 2-5 minutes)..."
aws ecs wait services-stable \
  --cluster "${ECS_CLUSTER}" \
  --services "${BACKEND_SERVICE}" "${FRONTEND_SERVICE}" \
  --region "${AWS_REGION}" && echo "✓ Services are stable." || \
  echo "⚠ Wait timed out — check ECS console for task status."

echo ""
echo "============================================="
echo "  ✅  Deployment Complete!"
echo "============================================="
echo ""
echo "  🌐  App URL (share this):  ${FRONTEND_URL}"
echo "  🔌  Backend API:           ${BACKEND_API_URL}"
echo ""
echo "  View logs:"
echo "    aws logs tail /ecs/knowledgeforge/backend  --follow --region ${AWS_REGION}"
echo "    aws logs tail /ecs/knowledgeforge/frontend --follow --region ${AWS_REGION}"
echo ""
