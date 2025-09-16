# HCL CDP Demo Banking App

[![Version](https://img.shields.io/github/v/release/HCL-CDP-TA/demo-banking)](https://github.com/HCL-CDP-TA/demo-banking/releases)
[![License](https://img.shields.io/github/license/HCL-CDP-TA/demo-banking)](LICENSE)

A demo banking application showcasing HCL Digital+ CDP integration with **multi-tenant architecture** supporting multiple industries (banking, insurance, telecom) with shared database infrastructure.

## Features

- **Multi-tenant architecture** with shared PostgreSQL database
- **Multi-industry support** (banking, insurance, telecom)
- Multi-brand banking demo (National Bank, First Bank)
- Multi-locale support (English, French, Spanish, German, etc.)
- HCL CDP (Customer Data Platform) integration
- HCL Interact API integration for personalized offers
- Modern React/Next.js architecture
- **Bootstrap deployment** with automatic script updates
- **PostgreSQL 16** with persistent shared storage

## Quick Start

### Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd banking-industry
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your industry-specific configuration
   ```

4. **Start shared database**

   ```bash
   ./manage-shared-db.sh start
   ```

5. **Start development server**
   ```bash
   npm run dev
   # OR use the deployment script for full environment
   ./deploy.sh local
   ```

## Deployment

The application uses a **multi-tenant architecture** with shared PostgreSQL database and bootstrap deployment pattern for automatic script updates.

### Prerequisites

- Docker and Docker Compose
- Git access to the repository
- `.env` configuration file

### Multi-Tenant Architecture

The deployment supports multiple industries sharing a single PostgreSQL 16 container:

- **Shared Database Container**: `shared-postgres-multitenant`
- **Industry-Specific Databases**: `banking`, `insurance`, `telecom`
- **Automatic Database Creation**: Each industry gets its own database
- **Shared Infrastructure**: Single PostgreSQL container serves all industries

### Deployment Methods

#### Local Development

```bash
# Start shared database and deploy application
./deploy.sh local

# Or manage components separately
./manage-shared-db.sh start    # Start shared PostgreSQL
./deploy.sh local              # Deploy application
```

**Local deployment characteristics:**

- Uses current directory
- Creates `banking` database automatically
- Runs on port `3000` (configurable via `.env`)
- **Container name**: `${DEPLOY_CONTAINER_PREFIX}-app` (e.g., `banking-app`)

#### Production (Bootstrap Pattern)

For production servers, use the bootstrap deployment pattern that automatically pulls the latest deployment scripts:

```bash
# On production server - deploy specific version
./server-deploy.sh v0.8.2-beta1 production
```

**Fetching/Updating server-deploy.sh:**

If the bootstrap script needs to be updated with latest changes:

```bash
# Download latest server-deploy.sh from GitHub
curl -o server-deploy.sh https://raw.githubusercontent.com/HCL-CDP-TA/demo-banking/main/server-deploy.sh

# Make script executable (first time only)
chmod +x server-deploy.sh
```

**Bootstrap deployment features:**

- **Automatic script updates**: Pulls latest `deploy.sh` from git repository
- **Fresh environment support**: Sets up everything from scratch
- **Industry-agnostic**: Works for banking, insurance, telecom using `DEPLOY_CONTAINER_PREFIX`
- **Docker Compose fallback**: Handles Docker snap package restrictions
- **Database initialization**: Creates shared PostgreSQL and industry databases
- **Version controlled**: Deploy specific git tags
- **Container cleanup**: Automatically handles container conflicts

### Environment Configuration

#### Multi-Tenant Configuration

Use `.env.example` as a template. Key multi-tenant settings:

```bash
# Industry vertical - determines database name
INDUSTRY_VERTICAL=banking

# Multi-tenant database connection (shared PostgreSQL container)
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/banking

# Application settings (industry-specific)
DEPLOY_IMAGE_NAME=${DEPLOY_CONTAINER_PREFIX}-app
DEPLOY_CONTAINER_PREFIX=banking
DEPLOY_SITE_PORT=3000

# CDP Integration
NEXT_PUBLIC_CDP_WRITEKEY=your_writekey
NEXT_PUBLIC_CDP_ENDPOINT=your_endpoint
NEXT_PUBLIC_INTERACT_ENDPOINT=your_interact_endpoint
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_DISCOVER_DEFAULT_SCRIPT=your_discover_script
```

#### Multi-Industry Examples

**Insurance Industry:**

```bash
INDUSTRY_VERTICAL=insurance
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/insurance
DEPLOY_IMAGE_NAME=insurance-app
DEPLOY_CONTAINER_PREFIX=insurance
DEPLOY_SITE_PORT=3001
```

**Telecom Industry:**

```bash
INDUSTRY_VERTICAL=telecom
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/telecom
DEPLOY_IMAGE_NAME=telecom-app
DEPLOY_CONTAINER_PREFIX=telecom
DEPLOY_SITE_PORT=3002
```

### Database Management

#### Shared Database Operations

```bash
# Database lifecycle management
./manage-shared-db.sh start     # Start shared PostgreSQL container
./manage-shared-db.sh status    # Check container status
./manage-shared-db.sh logs      # View database logs
./manage-shared-db.sh stop      # Stop container
./manage-shared-db.sh restart   # Restart container
./manage-shared-db.sh remove    # Remove container and data (destructive)
```

#### Database Details

- **Container**: `shared-postgres-multitenant`
- **Version**: PostgreSQL 16
- **Platform**: linux/amd64
- **Port**: 5432
- **User**: `multitenant_user`
- **Password**: `multitenant_password`
- **Network**: `multitenant-network`
- **Volume**: `shared_postgres_multitenant_data`

### Deployment Scripts

#### Core Scripts

1. **`deploy.sh`** - Main deployment script

   - Handles local/production environments
   - Creates industry-specific databases automatically
   - Manages container lifecycle

2. **`server-deploy.sh`** - Bootstrap deployment script

   - Pulls latest deployment scripts from git
   - Sets up fresh environments
   - Handles Docker Compose compatibility issues

3. **`manage-shared-db.sh`** - Database management script
   - Manages shared PostgreSQL container
   - Provides database lifecycle operations
   - Used by main deployment script

## Architecture

- **Multi-tenant**: Shared PostgreSQL 16 container serving multiple industries
- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16 with Prisma ORM
- **Containerization**: Docker with multi-stage builds
- **Deployment**: Bootstrap pattern with automatic script updates
- **Internationalization**: next-intl
- **CDP Integration**: HCL Digital+ CDP
- **Personalization**: HCL Interact API

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Database

The application uses Prisma for database management with multi-tenant support:

```bash
# Ensure shared database is running
./manage-shared-db.sh start

# Apply migrations to your industry database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (connects to your configured industry database)
npx prisma studio
```

### Multi-Tenant Development

When developing for multiple industries:

1. **Set up industry-specific `.env` files**
2. **Use industry-specific container names** to avoid conflicts
3. **All industries share the same PostgreSQL container** but use separate databases

## Troubleshooting

### Database Connection Issues

```bash
# Check shared database status
./manage-shared-db.sh status

# View database logs
./manage-shared-db.sh logs

# Restart database if needed
./manage-shared-db.sh restart
```

### Container Conflicts

```bash
# Stop all industry containers
docker rm -f banking-app insurance-app telecom-app

# Clean deployment and restart
./deploy.sh local
```

### Fresh Environment Setup

For completely fresh deployments:

```bash
# Remove all data (destructive!)
./manage-shared-db.sh remove

# Start fresh
./deploy.sh local
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally using `./deploy.sh local`
4. Test multi-tenant setup if changes affect database/deployment
5. Submit a pull request

## Documentation

- **[Multi-Tenant Setup Guide](MULTITENANT.md)** - Detailed multi-tenant architecture
- **[Server Deployment Guide](SERVER_DEPLOYMENT.md)** - Production deployment instructions
- **[Release Process](RELEASE_AUTOMATION.md)** - Version management and releases

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.
