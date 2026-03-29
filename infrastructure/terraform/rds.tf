# ── RDS Subnet Group ───────────────────────────────────────────────────────────
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

# ── RDS PostgreSQL Instance ────────────────────────────────────────────────────
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  engine         = "postgres"
  engine_version = "16.3"
  instance_class = var.db_instance_class

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # Storage
  allocated_storage     = 20
  max_allocated_storage = 100 # Enable auto-scaling up to 100GB
  storage_type          = "gp3"
  storage_encrypted     = true

  # Networking
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Backups
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Performance
  performance_insights_enabled = false # Enable for production (extra cost)

  # Deletion protection — set to true for production
  deletion_protection = false
  skip_final_snapshot = true # Set to false in production

  tags = {
    Name        = "${var.project_name}-db"
    Environment = var.environment
  }
}
