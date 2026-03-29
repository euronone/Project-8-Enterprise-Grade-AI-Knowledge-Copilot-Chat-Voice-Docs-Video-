#!/bin/bash
# ── KnowledgeForge: RECREATE all AWS resources ───────────────────────────────
# Rebuilds everything from scratch after destroy.
# Run: bash infrastructure/recreate.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/terraform"
REGION="us-east-1"

# Load credentials
if [ -f "$SCRIPT_DIR/.env" ]; then
  source "$SCRIPT_DIR/.env"
fi

echo ""
echo "══════════════════════════════════════════════"
echo "  KnowledgeForge — RECREATING all AWS resources"
echo "  (takes ~20-25 min total)"
echo "══════════════════════════════════════════════"
echo ""

# ── Step 1: Terraform apply ────────────────────────────────────────────────────
echo "▶ [1/4] Creating infrastructure with Terraform (10-15 min)..."
cd "$TERRAFORM_DIR"

MSYS_NO_PATHCONV=1 /c/Users/Hp/AppData/Local/Microsoft/WinGet/Links/terraform.exe apply \
  -auto-approve \
  2>&1

# Read outputs
CF_DOMAIN=$(MSYS_NO_PATHCONV=1 /c/Users/Hp/AppData/Local/Microsoft/WinGet/Links/terraform.exe output -raw cloudfront_domain 2>/dev/null)
ECR_BACKEND=$(MSYS_NO_PATHCONV=1 /c/Users/Hp/AppData/Local/Microsoft/WinGet/Links/terraform.exe output -raw ecr_backend_url 2>/dev/null)
ECR_FRONTEND=$(MSYS_NO_PATHCONV=1 /c/Users/Hp/AppData/Local/Microsoft/WinGet/Links/terraform.exe output -raw ecr_frontend_url 2>/dev/null)

echo "  ✓ Infrastructure ready"
echo "  CloudFront: https://$CF_DOMAIN"

# ── Step 2: ECR login ─────────────────────────────────────────────────────────
echo ""
echo "▶ [2/4] Logging into ECR..."
ACCOUNT_ID=$(MSYS_NO_PATHCONV=1 aws sts get-caller-identity --region "$REGION" --query Account --output text)
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
echo "  ✓ ECR login successful"

# ── Step 3: Build and push backend ───────────────────────────────────────────
echo ""
echo "▶ [3/4] Building and pushing backend image..."
cd "$SCRIPT_DIR/../backend"
docker build -t "$ECR_BACKEND:latest" . 2>&1 | tail -3
docker push "$ECR_BACKEND:latest" 2>&1 | tail -3
echo "  ✓ Backend image pushed"

# ── Step 4: Build and push frontend ──────────────────────────────────────────
echo ""
echo "▶ [4/4] Building and pushing frontend image (with HTTPS URL baked in)..."
cd "$SCRIPT_DIR/../frontend"
docker build \
  --build-arg NEXT_PUBLIC_API_URL="https://$CF_DOMAIN" \
  --build-arg NEXT_PUBLIC_WS_URL="wss://$CF_DOMAIN" \
  --build-arg NEXT_PUBLIC_APP_NAME="KnowledgeForge" \
  -t "$ECR_FRONTEND:latest" \
  . 2>&1 | tail -3
docker push "$ECR_FRONTEND:latest" 2>&1 | tail -3
echo "  ✓ Frontend image pushed"

# ── Step 5: Force ECS redeploy ────────────────────────────────────────────────
echo ""
echo "▶ Deploying to ECS..."
MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster knowledgeforge-cluster \
  --service knowledgeforge-backend-svc \
  --force-new-deployment \
  --region "$REGION" --output text --query 'service.serviceName' > /dev/null

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster knowledgeforge-cluster \
  --service knowledgeforge-frontend-svc \
  --force-new-deployment \
  --region "$REGION" --output text --query 'service.serviceName' > /dev/null

echo "  ✓ ECS deployments triggered"
echo ""
echo "▶ Waiting for services to start (3-5 min)..."

for i in $(seq 1 24); do
  COUNTS=$(MSYS_NO_PATHCONV=1 aws ecs describe-services \
    --cluster knowledgeforge-cluster \
    --services knowledgeforge-backend-svc knowledgeforge-frontend-svc \
    --region "$REGION" \
    --query 'services[*].runningCount' \
    --output text 2>&1)
  B=$(echo "$COUNTS" | awk '{print $1}')
  F=$(echo "$COUNTS" | awk '{print $2}')
  if [ "$B" = "1" ] && [ "$F" = "1" ]; then
    echo "  ✓ Both services running!"
    break
  fi
  echo "  [$i/24] Backend: $B/1  Frontend: $F/1 — waiting 15s..."
  sleep 15
done

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ RECREATED — app is live at:"
echo ""
echo "  https://$CF_DOMAIN"
echo ""
echo "  Demo login:"
echo "    Email:    demo@knowledgeforge.ai"
echo "    Password: demo12345"
echo "══════════════════════════════════════════════"
echo ""
