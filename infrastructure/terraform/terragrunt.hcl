terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}

locals {
  project = "knowledgeforge"
  
  environment = terraform.workspace == "default" ? "dev" : terraform.workspace
  
  common_tags = {
    Project     = local.project
    Environment = local.environment
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }
}

# Remote state configuration
remote_config = read_terragrunt_config(find_in_parent_folders("backend.hcl"))

generate "backend" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents  = remote_config.terraform.backend.config
}

# Provider configuration
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<-EOF
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "knowledgeforge"
      Environment = "${local.environment}"
      ManagedBy   = "Terraform"
    }
  }
}
EOF
}

# Input variables
inputs = {
  project     = local.project
  environment = local.environment
  aws_region  = "us-east-1"
}
