#!/bin/bash
# ── KnowledgeForge: DESTROY all AWS resources (bill → $0) ────────────────────
# Tears down every AWS resource via Terraform.
# To restore everything: bash infrastructure/recreate.sh
# Run: bash infrastructure/destroy.sh

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
echo "  KnowledgeForge — DESTROYING all AWS resources"
echo "  Bill will be: \$0"
echo "══════════════════════════════════════════════"
echo ""
echo "  ⚠  This will DELETE:"
echo "     • ECS services + tasks"
echo "     • RDS PostgreSQL (ALL DATA LOST)"
echo "     • ElastiCache Redis"
echo "     • ALB, CloudFront, VPC, NAT Gateway"
echo "     • S3 bucket contents"
echo "     • Secrets Manager secrets"
echo "     • All other resources"
echo ""
read -p "  Type 'yes' to confirm: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "  Cancelled."
  exit 0
fi

echo ""

# ── Step 1: Scale ECS to 0 first (so Terraform can delete cleanly) ─────────────
echo "▶ Scaling ECS services to 0 (required before destroy)..."
MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster knowledgeforge-cluster \
  --service knowledgeforge-backend-svc \
  --desired-count 0 \
  --region "$REGION" --output text --query 'service.serviceName' > /dev/null 2>&1 || true

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster knowledgeforge-cluster \
  --service knowledgeforge-frontend-svc \
  --desired-count 0 \
  --region "$REGION" --output text --query 'service.serviceName' > /dev/null 2>&1 || true

echo "  ✓ ECS scaled to 0"
echo "  ⏳ Waiting 30s for tasks to stop..."
sleep 30

# ── Step 2: Empty S3 bucket (Terraform can't delete non-empty buckets) ─────────
echo ""
echo "▶ Emptying S3 bucket..."
ACCOUNT_ID=$(MSYS_NO_PATHCONV=1 aws sts get-caller-identity --region "$REGION" --query Account --output text 2>&1)
BUCKET="knowledgeforge-uploads-$ACCOUNT_ID"

MSYS_NO_PATHCONV=1 aws s3 rm "s3://$BUCKET" --recursive --region "$REGION" 2>/dev/null || true
echo "  ✓ S3 bucket emptied"

# ── Step 3: Delete ECR images (Terraform can't delete non-empty repos) ──────────
echo ""
echo "▶ Clearing ECR repositories..."
for REPO in knowledgeforge-frontend knowledgeforge-backend; do
  MSYS_NO_PATHCONV=1 aws ecr batch-delete-image \
    --repository-name "$REPO" \
    --region "$REGION" \
    --image-ids "$(MSYS_NO_PATHCONV=1 aws ecr list-images --repository-name "$REPO" --region "$REGION" --query 'imageIds' --output json 2>/dev/null)" \
    --output text > /dev/null 2>&1 || true
done
echo "  ✓ ECR images cleared"

# ── Step 4: Terraform destroy ──────────────────────────────────────────────────
echo ""
echo "▶ Running terraform destroy (takes 10-15 min)..."
cd "$TERRAFORM_DIR"

MSYS_NO_PATHCONV=1 /c/Users/Hp/AppData/Local/Microsoft/WinGet/Links/terraform.exe destroy \
  -auto-approve \
  2>&1

echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ ALL RESOURCES DESTROYED"
echo "  Your AWS bill is now: \$0"
echo ""
echo "  To recreate everything:"
echo "    bash infrastructure/recreate.sh"
echo "══════════════════════════════════════════════"
echo ""
