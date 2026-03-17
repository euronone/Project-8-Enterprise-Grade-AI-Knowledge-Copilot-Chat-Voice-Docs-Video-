# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier          = "${var.project}-${var.environment}-postgres"
  engine              = "postgres"
  engine_version      = "16.1"
  instance_class      = var.instance_class
  allocated_storage   = var.allocated_storage
  storage_encrypted   = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az            = true
  publicly_accessible = false
  skip_final_snapshot = var.environment == "dev"
  
  tags = var.tags
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-${var.environment}-rds-subnet"
  subnet_ids = var.private_subnets

  tags = var.tags
}

resource "aws_security_group" "rds" {
  name   = "${var.project}-${var.environment}-rds-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

