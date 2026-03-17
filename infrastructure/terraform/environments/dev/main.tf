locals {
  project     = var.project
  environment = var.environment
  aws_region  = var.aws_region
  
  # Environment-specific configurations
  vpc_cidr             = "10.0.0.0/16"
  eks_cluster_version  = "1.29"
  rds_allocated_storage = 20
  redis_node_type      = "cache.t3.micro"
  
  tags = merge(
    var.common_tags,
    {
      Environment = local.environment
    }
  )
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"
  
  project     = local.project
  environment = local.environment
  aws_region  = local.aws_region
  vpc_cidr    = local.vpc_cidr
  
  tags = local.tags
}

# EKS Cluster Module
module "eks" {
  source = "../../modules/eks"
  
  project            = local.project
  environment        = local.environment
  cluster_name       = "${local.project}-${local.environment}"
  cluster_version    = local.eks_cluster_version
  vpc_id             = module.vpc.vpc_id
  private_subnets   = module.vpc.private_subnet_ids
  
  tags = local.tags
  
  depends_on = [module.vpc]
}

# RDS Module
module "rds" {
  source = "../../modules/rds"
  
  project     = local.project
  environment = local.environment
  db_name     = "knowledgeforge"
  vpc_id      = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  
  allocated_storage = local.rds_allocated_storage
  instance_class    = "db.t3.micro"
  
  tags = local.tags
  
  depends_on = [module.vpc]
}

# ElastiCache Redis Module
module "redis" {
  source = "../../modules/elasticache"
  
  project      = local.project
  environment  = local.environment
  cluster_name = "${local.project}-${local.environment}-redis"
  engine       = "redis"
  node_type    = local.redis_node_type
  num_cache_nodes = 1
  
  vpc_id           = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  
  tags = local.tags
  
  depends_on = [module.vpc]
}

# S3 Module for document storage
module "s3" {
  source = "../../modules/s3"
  
  project     = local.project
  environment = local.environment
  
  buckets = {
    documents = {
      bucket_name = "${local.project}-documents-${local.environment}"
      purpose     = "Knowledge base document storage"
    }
    media = {
      bucket_name = "${local.project}-media-${local.environment}"
      purpose     = "Video and media storage"
    }
    backups = {
      bucket_name = "${local.project}-backups-${local.environment}"
      purpose     = "Database backups"
    }
  }
  
  tags = local.tags
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"
  
  project     = local.project
  environment = local.environment
  
  repositories = [
    "knowledgeforge-backend",
    "knowledgeforge-frontend",
    "knowledgeforge-worker"
  ]
  
  tags = local.tags
}

# Outputs
output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "redis_endpoint" {
  value = module.redis.endpoint
}

output "s3_buckets" {
  value = module.s3.bucket_names
}
