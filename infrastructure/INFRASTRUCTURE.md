# KnowledgeForge Infrastructure Configuration
# Generated: 2026-03-17

## Overview
This Terraform infrastructure defines the complete AWS deployment for KnowledgeForge AI.

## Environments
- **dev**: Development environment for testing
- **staging**: Staging environment for pre-production validation
- **production**: Production environment

## Architecture
- **Networking**: VPC with public/private subnets across 2 AZs, NAT Gateway, Internet Gateway
- **Compute**: EKS Kubernetes cluster with auto-scaling node groups
- **Database**: RDS PostgreSQL multi-AZ for relational data
- **Cache**: ElastiCache Redis for session/cache layer
- **Search**: OpenSearch (Elasticsearch) for full-text and semantic search
- **Storage**: S3 for documents, media, and backups
- **Registry**: ECR for container images
- **CDN**: CloudFront for global content delivery
- **Load Balancing**: ALB for HTTP/HTTPS traffic routing
- **Security**: WAF, Security Groups, IAM roles and policies
- **DNS**: Route53 for domain management
- **Certificates**: ACM for SSL/TLS
- **Secrets**: Secrets Manager for credential management
- **Monitoring**: CloudWatch, Prometheus, Grafana
- **Events**: MSK (Managed Kafka) for event streaming
- **Email**: SES for transactional emails
- **Video**: MediaConvert for video processing
- **Backup**: AWS Backup for automated backups

## File Structure
```
infrastructure/
├── terraform/
│   ├── terragrunt.hcl           # Root configuration
│   ├── environments/
│   │   ├── dev/                 # Development environment
│   │   ├── staging/             # Staging environment
│   │   └── production/          # Production environment
│   └── modules/                 # Reusable Terraform modules
│       ├── vpc/                 # VPC and networking
│       ├── eks/                 # EKS Kubernetes cluster
│       ├── rds/                 # RDS PostgreSQL
│       ├── elasticache/         # Redis cache
│       ├── elasticsearch/       # OpenSearch
│       ├── s3/                  # S3 buckets
│       ├── cloudfront/          # CloudFront CDN
│       ├── ecr/                 # ECR registry
│       ├── alb/                 # Application Load Balancer
│       ├── waf/                 # AWS WAF
│       ├── route53/             # Route53 DNS
│       ├── acm/                 # ACM certificates
│       ├── secrets/             # Secrets Manager
│       ├── monitoring/          # CloudWatch/Monitoring
│       ├── kafka/               # MSK Kafka
│       ├── ses/                 # SES email
│       ├── mediaconvert/        # MediaConvert
│       ├── backup/              # AWS Backup
│       └── iam/                 # IAM roles/policies
└── kubernetes/
    ├── base/                    # Base K8s resources
    ├── apps/                    # Application deployments
    ├── monitoring/              # Monitoring stack (Prometheus, Grafana)
    ├── security/               # Security configs
    └── argocd/                 # ArgoCD GitOps setup

## Status
- [x] Terraform structure initialized
- [x] VPC module implemented
- [ ] EKS module (in progress)
- [ ] RDS module (in progress)
- [ ] Other modules (in progress)
- [ ] Kubernetes manifests (in progress)
- [ ] ArgoCD configuration (in progress)

## Next Steps
1. Implement remaining Terraform modules
2. Create Kubernetes deployment manifests
3. Configure ArgoCD for GitOps
4. Set up monitoring and logging
5. Configure backup and disaster recovery

## Deployment
**IMPORTANT**: Do NOT deploy until all configuration is validated.

To validate:
```bash
terraform init
terraform plan
terraform validate
```

To deploy (when ready):
```bash
terraform apply
```
