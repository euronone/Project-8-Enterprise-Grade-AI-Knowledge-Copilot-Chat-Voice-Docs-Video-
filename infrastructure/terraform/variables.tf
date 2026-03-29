variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "knowledgeforge"
}

variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
  default     = "production"
}

# ── Networking ─────────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (ALB)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (ECS, RDS, Redis)"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

# ── Database ───────────────────────────────────────────────────────────────────
variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "knowledgeforge"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "kfadmin"
}

variable "db_password" {
  description = "PostgreSQL master password (min 8 chars)"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"
}

# ── Cache ──────────────────────────────────────────────────────────────────────
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

# ── ECS ────────────────────────────────────────────────────────────────────────
variable "backend_cpu" {
  description = "Backend ECS task CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Backend ECS task memory in MB"
  type        = number
  default     = 1024
}

variable "frontend_cpu" {
  description = "Frontend ECS task CPU units"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Frontend ECS task memory in MB"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Number of backend ECS task instances"
  type        = number
  default     = 1
}

variable "frontend_desired_count" {
  description = "Number of frontend ECS task instances"
  type        = number
  default     = 1
}

# ── App Secrets (stored in AWS Secrets Manager) ────────────────────────────────
variable "secret_key" {
  description = "JWT secret key for the backend (use: openssl rand -hex 32)"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth secret for the frontend (use: openssl rand -hex 32)"
  type        = string
  sensitive   = true
}

variable "anthropic_api_key" {
  description = "Anthropic (Claude) API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "tavily_api_key" {
  description = "Tavily web search API key"
  type        = string
  sensitive   = true
  default     = ""
}
