#!/bin/bash
# ── KnowledgeForge: PAUSE all services ────────────────────────────────────────
# Stops ECS tasks and RDS to minimize AWS costs.
# ElastiCache cannot be "stopped" (AWS limitation) — it keeps running at ~$13/mo.
# Run: bash infrastructure/pause.sh

set -e

REGION="us-east-1"
CLUSTER="knowledgeforge-cluster"
BACKEND_SVC="knowledgeforge-backend-svc"
FRONTEND_SVC="knowledgeforge-frontend-svc"
RDS_ID="knowledgeforge-db"

# Load credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  source "$SCRIPT_DIR/.env"
fi

echo ""
echo "══════════════════════════════════════════════"
echo "  KnowledgeForge — PAUSING services"
echo "══════════════════════════════════════════════"
echo ""

# ── Step 1: Scale ECS services to 0 ───────────────────────────────────────────
echo "▶ Scaling ECS services to 0..."

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$BACKEND_SVC" \
  --desired-count 0 \
  --region "$REGION" \
  --output text --query 'service.serviceName' > /dev/null

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$FRONTEND_SVC" \
  --desired-count 0 \
  --region "$REGION" \
  --output text --query 'service.serviceName' > /dev/null

echo "  ✓ Backend service → 0 tasks"
echo "  ✓ Frontend service → 0 tasks"

# ── Step 2: Stop RDS ──────────────────────────────────────────────────────────
echo ""
echo "▶ Stopping RDS instance (knowledgeforge-db)..."

RDS_STATUS=$(MSYS_NO_PATHCONV=1 aws rds describe-db-instances \
  --db-instance-identifier "$RDS_ID" \
  --region "$REGION" \
  --query 'DBInstances[0].DBInstanceStatus' \
  --output text 2>&1)

if [ "$RDS_STATUS" = "available" ]; then
  MSYS_NO_PATHCONV=1 aws rds stop-db-instance \
    --db-instance-identifier "$RDS_ID" \
    --region "$REGION" \
    --output text --query 'DBInstance.DBInstanceStatus' > /dev/null
  echo "  ✓ RDS stopping... (takes ~2 min to fully stop)"
elif [ "$RDS_STATUS" = "stopped" ]; then
  echo "  ℹ RDS already stopped"
else
  echo "  ⚠ RDS status is '$RDS_STATUS' — skipping stop"
fi

# ── Step 3: Wait for ECS tasks to drain ───────────────────────────────────────
echo ""
echo "▶ Waiting for ECS tasks to stop..."
sleep 15

RUNNING=$(MSYS_NO_PATHCONV=1 aws ecs describe-services \
  --cluster "$CLUSTER" \
  --services "$BACKEND_SVC" "$FRONTEND_SVC" \
  --region "$REGION" \
  --query 'services[*].runningCount' \
  --output text 2>&1)
echo "  Running tasks: $RUNNING (will reach 0 in ~30s)"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ PAUSED — estimated savings:"
echo ""
echo "  ECS Fargate (2 tasks)    ~ stopped"
echo "  RDS db.t3.micro          ~ stopping"
echo "  ─────────────────────────────────────"
echo "  ElastiCache cache.t3.micro  still running (~\$13/mo — AWS limitation)"
echo "  ALB                         still running (~\$17/mo — AWS limitation)"
echo "  NAT Gateway                 still running (~\$32/mo — AWS limitation)"
echo ""
echo "  App will be unreachable until you run:  bash infrastructure/resume.sh"
echo "══════════════════════════════════════════════"
echo ""
