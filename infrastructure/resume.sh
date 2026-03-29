#!/bin/bash
# ── KnowledgeForge: RESUME all services ───────────────────────────────────────
# Starts RDS, then scales ECS back up.
# Run: bash infrastructure/resume.sh

set -e

REGION="us-east-1"
CLUSTER="knowledgeforge-cluster"
BACKEND_SVC="knowledgeforge-backend-svc"
FRONTEND_SVC="knowledgeforge-frontend-svc"
RDS_ID="knowledgeforge-db"
APP_URL="https://d1zauxujxypoxy.cloudfront.net"

# Load credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  source "$SCRIPT_DIR/.env"
fi

echo ""
echo "══════════════════════════════════════════════"
echo "  KnowledgeForge — RESUMING services"
echo "══════════════════════════════════════════════"
echo ""

# ── Step 1: Start RDS ─────────────────────────────────────────────────────────
echo "▶ Starting RDS instance (knowledgeforge-db)..."

RDS_STATUS=$(MSYS_NO_PATHCONV=1 aws rds describe-db-instances \
  --db-instance-identifier "$RDS_ID" \
  --region "$REGION" \
  --query 'DBInstances[0].DBInstanceStatus' \
  --output text 2>&1)

if [ "$RDS_STATUS" = "stopped" ]; then
  MSYS_NO_PATHCONV=1 aws rds start-db-instance \
    --db-instance-identifier "$RDS_ID" \
    --region "$REGION" \
    --output text --query 'DBInstance.DBInstanceStatus' > /dev/null
  echo "  ✓ RDS starting..."
elif [ "$RDS_STATUS" = "available" ]; then
  echo "  ℹ RDS already running"
else
  echo "  ⏳ RDS status: $RDS_STATUS — waiting..."
fi

# ── Step 2: Wait for RDS to become available ──────────────────────────────────
echo ""
echo "▶ Waiting for RDS to become available (this takes 3-5 min)..."
echo "  Press Ctrl+C to skip waiting — ECS will retry connecting automatically"
echo ""

for i in $(seq 1 30); do
  RDS_STATUS=$(MSYS_NO_PATHCONV=1 aws rds describe-db-instances \
    --db-instance-identifier "$RDS_ID" \
    --region "$REGION" \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text 2>&1)

  if [ "$RDS_STATUS" = "available" ]; then
    echo "  ✓ RDS is available!"
    break
  fi

  echo "  [$i/30] RDS status: $RDS_STATUS — waiting 15s..."
  sleep 15
done

# ── Step 3: Scale ECS services back up ───────────────────────────────────────
echo ""
echo "▶ Scaling ECS services to 1..."

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$BACKEND_SVC" \
  --desired-count 1 \
  --region "$REGION" \
  --output text --query 'service.serviceName' > /dev/null

MSYS_NO_PATHCONV=1 aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$FRONTEND_SVC" \
  --desired-count 1 \
  --region "$REGION" \
  --output text --query 'service.serviceName' > /dev/null

echo "  ✓ Backend service → 1 task"
echo "  ✓ Frontend service → 1 task"

# ── Step 4: Wait for ECS tasks to start ──────────────────────────────────────
echo ""
echo "▶ Waiting for ECS tasks to start (2-3 min)..."

for i in $(seq 1 20); do
  COUNTS=$(MSYS_NO_PATHCONV=1 aws ecs describe-services \
    --cluster "$CLUSTER" \
    --services "$BACKEND_SVC" "$FRONTEND_SVC" \
    --region "$REGION" \
    --query 'services[*].runningCount' \
    --output text 2>&1)

  BACKEND_COUNT=$(echo "$COUNTS" | awk '{print $1}')
  FRONTEND_COUNT=$(echo "$COUNTS" | awk '{print $2}')

  if [ "$BACKEND_COUNT" = "1" ] && [ "$FRONTEND_COUNT" = "1" ]; then
    echo "  ✓ Both services running!"
    break
  fi

  echo "  [$i/20] Backend: $BACKEND_COUNT/1  Frontend: $FRONTEND_COUNT/1 — waiting 15s..."
  sleep 15
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ RESUMED — app is live at:"
echo ""
echo "  $APP_URL"
echo ""
echo "  Demo login:"
echo "    Email:    demo@knowledgeforge.ai"
echo "    Password: demo12345"
echo "══════════════════════════════════════════════"
echo ""
