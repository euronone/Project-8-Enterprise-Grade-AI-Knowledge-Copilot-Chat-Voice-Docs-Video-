variable "project" {
  description = "Project name"
  type        = string
  default     = "knowledgeforge"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project   = "knowledgeforge"
    ManagedBy = "Terraform"
  }
}
