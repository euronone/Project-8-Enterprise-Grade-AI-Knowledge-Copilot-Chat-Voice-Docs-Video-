output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "infrastructure_summary" {
  description = "Summary of created infrastructure"
  value = {
    project     = var.project
    environment = var.environment
    region      = var.aws_region
  }
}
