# KnowledgeForge AI Copilot

Enterprise-Grade AI Knowledge Copilot — Chat, Voice, Docs & Video

## Overview

KnowledgeForge is an enterprise-grade AI Knowledge Copilot that serves as a company-wide AI brain. Employees interact via **chat**, **voice**, and **meetings/video**. It ingests, indexes, and reasons over every piece of organizational knowledge — documents, wikis, Slack threads, emails, meeting recordings, video content, codebases, and databases.

## Tech Stack

- **Frontend:** Next.js 14+ (TypeScript, Tailwind CSS, Zustand, Socket.IO)
- **Backend:** Python 3.12+ (FastAPI, LangChain, LlamaIndex)
- **AI/LLM:** Claude API (Anthropic) + OpenAI API
- **Vector DB:** Pinecone + pgvector
- **Database:** PostgreSQL 16 (SQLAlchemy + Alembic)
- **Cache:** Redis 7
- **Search:** Elasticsearch 8
- **Queue:** Apache Kafka + Celery
- **Infrastructure:** AWS (EKS, Terraform, ArgoCD)

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker & Docker Compose
- Make

### Local Development

```bash
# Clone the repository
git clone https://github.com/euronone/Project-8-Enterprise-Grade-AI-Knowledge-Copilot-Chat-Voice-Docs-Video-.git
cd Project-8-Enterprise-Grade-AI-Knowledge-Copilot-Chat-Voice-Docs-Video-

# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -e ".[dev]" && uvicorn app.main:app --reload
```

### Makefile Commands

```bash
make dev          # Start local development
make test         # Run all tests
make lint         # Run linters
make build        # Build Docker images
make migrate      # Run database migrations
make seed         # Seed database
```

## Project Structure

```
├── frontend/          # Next.js 14+ frontend
├── backend/           # FastAPI backend
├── infrastructure/    # Terraform + Kubernetes
├── shared/            # Shared schemas & protos
├── docs/              # Documentation
└── tools/             # Developer tools & scripts
```

## Documentation

- [System Design](docs/architecture/system-design.md)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/runbooks/deployment.md)
- [Security Architecture](docs/architecture/security.md)

## License

Proprietary — All rights reserved.
