# ── Secrets Manager — App Secrets ─────────────────────────────────────────────
# Stores all sensitive env vars as a single JSON secret
# ECS task definitions reference individual keys via valueFrom
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.project_name}/${var.environment}/secrets"
  description             = "KnowledgeForge application secrets"
  recovery_window_in_days = 0 # Immediate deletion (set to 7-30 for production)

  tags = {
    Name        = "${var.project_name}-secrets"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id

  secret_string = jsonencode({
    DATABASE_URL    = "postgresql+asyncpg://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:5432/${var.db_name}"
    REDIS_URL       = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"
    SECRET_KEY      = var.secret_key
    NEXTAUTH_SECRET = var.nextauth_secret
    ANTHROPIC_API_KEY = var.anthropic_api_key
    OPENAI_API_KEY    = var.openai_api_key
    TAVILY_API_KEY    = var.tavily_api_key
    S3_BUCKET_NAME    = aws_s3_bucket.uploads.bucket
    AWS_REGION        = var.aws_region
  })

  depends_on = [
    aws_db_instance.main,
    aws_elasticache_cluster.redis,
    aws_s3_bucket.uploads
  ]
}
