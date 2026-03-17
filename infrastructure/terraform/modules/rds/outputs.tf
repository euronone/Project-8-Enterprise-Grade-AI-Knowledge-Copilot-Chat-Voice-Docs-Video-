output "endpoint" {
  value = aws_db_instance.main.endpoint
}

output "database_name" {
  value = aws_db_instance.main.db_name
}

output "db_password_secret_name" {
  value = "${var.project}/${var.environment}/rds/password"
}

