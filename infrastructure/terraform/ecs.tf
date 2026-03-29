# ── ECS Cluster ────────────────────────────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project_name}-cluster"
    Environment = var.environment
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }
}

# ── Local: secret ARN shortcut ─────────────────────────────────────────────────
locals {
  secret_arn = aws_secretsmanager_secret.app_secrets.arn
}

# ── Backend Task Definition ────────────────────────────────────────────────────
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "backend"
    image     = "${aws_ecr_repository.backend.repository_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 8000
      protocol      = "tcp"
    }]

    # Non-sensitive env vars
    environment = [
      { name = "CORS_ORIGINS",               value = "[\"https://${aws_cloudfront_distribution.main.domain_name}\",\"http://${aws_lb.main.dns_name}\",\"http://${aws_lb.main.dns_name}:8000\"]" },
      { name = "UPLOAD_DIR",                 value = "/tmp/uploads" },
      { name = "MAX_UPLOAD_SIZE_MB",         value = "50" },
      { name = "ACCESS_TOKEN_EXPIRE_MINUTES", value = "60" },
      { name = "REFRESH_TOKEN_EXPIRE_DAYS",  value = "30" },
      { name = "APP_VERSION",               value = "1.0.0" }
    ]

    # Sensitive env vars injected from Secrets Manager
    secrets = [
      { name = "DATABASE_URL",      valueFrom = "${local.secret_arn}:DATABASE_URL::" },
      { name = "REDIS_URL",         valueFrom = "${local.secret_arn}:REDIS_URL::" },
      { name = "SECRET_KEY",        valueFrom = "${local.secret_arn}:SECRET_KEY::" },
      { name = "ANTHROPIC_API_KEY", valueFrom = "${local.secret_arn}:ANTHROPIC_API_KEY::" },
      { name = "OPENAI_API_KEY",    valueFrom = "${local.secret_arn}:OPENAI_API_KEY::" },
      { name = "TAVILY_API_KEY",    valueFrom = "${local.secret_arn}:TAVILY_API_KEY::" },
      { name = "S3_BUCKET_NAME",    valueFrom = "${local.secret_arn}:S3_BUCKET_NAME::" },
      { name = "AWS_REGION",        valueFrom = "${local.secret_arn}:AWS_REGION::" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "backend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8000/health')\" || exit 1"]
      interval    = 30
      timeout     = 10
      retries     = 3
      startPeriod = 90
    }
  }])

  tags = {
    Name        = "${var.project_name}-backend"
    Environment = var.environment
  }
}

# ── Frontend Task Definition ───────────────────────────────────────────────────
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = "${aws_ecr_repository.frontend.repository_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 3000
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV",              value = "production" },
      { name = "NEXT_PUBLIC_APP_NAME",  value = "KnowledgeForge" },
      # NOTE: NEXT_PUBLIC_* vars are baked in at image build time (see deploy.sh)
      # These runtime vars are for server-side NextAuth only
      { name = "NEXTAUTH_URL",          value = "https://${aws_cloudfront_distribution.main.domain_name}" }
    ]

    secrets = [
      { name = "NEXTAUTH_SECRET", valueFrom = "${local.secret_arn}:NEXTAUTH_SECRET::" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "frontend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })\" || exit 1"]
      interval    = 30
      timeout     = 15
      retries     = 5
      startPeriod = 120
    }
  }])

  tags = {
    Name        = "${var.project_name}-frontend"
    Environment = var.environment
  }
}

# ── Backend ECS Service ────────────────────────────────────────────────────────
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-svc"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 8000
  }

  # Allow rolling updates without downtime
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [
    aws_lb_listener.backend,
    aws_iam_role_policy_attachment.ecs_execution_managed
  ]

  tags = {
    Name        = "${var.project_name}-backend-svc"
    Environment = var.environment
  }
}

# ── Frontend ECS Service ───────────────────────────────────────────────────────
resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-frontend-svc"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.frontend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 3000
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [
    aws_lb_listener.frontend,
    aws_iam_role_policy_attachment.ecs_execution_managed
  ]

  tags = {
    Name        = "${var.project_name}-frontend-svc"
    Environment = var.environment
  }
}
