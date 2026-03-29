output "alb_dns_name" {
  description = "ALB DNS name (internal use)"
  value       = aws_lb.main.dns_name
}

output "frontend_url" {
  description = "Frontend HTTPS URL via CloudFront — share this with users"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "backend_api_url" {
  description = "Backend API URL via CloudFront HTTPS (used by frontend)"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "backend_ws_url" {
  description = "Backend WebSocket URL"
  value       = "wss://${aws_cloudfront_distribution.main.domain_name}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)"
  value       = aws_cloudfront_distribution.main.id
}

output "ecr_frontend_url" {
  description = "ECR repository URL for frontend image"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_url" {
  description = "ECR repository URL for backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_backend_service_name" {
  description = "ECS backend service name"
  value       = aws_ecs_service.backend.name
}

output "ecs_frontend_service_name" {
  description = "ECS frontend service name"
  value       = aws_ecs_service.frontend.name
}

output "s3_bucket_name" {
  description = "S3 bucket for file uploads"
  value       = aws_s3_bucket.uploads.bucket
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.main.address
  sensitive   = true
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "aws_account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}
