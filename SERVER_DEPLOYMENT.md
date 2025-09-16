# Server Deployment Guide

This guide explains how to deploy the banking application to your production server using the bootstrap deployment approach.

## Overview

The deployment uses a **bootstrap script** approach to solve the "chicken and egg" problem of updating deployment scripts:

1. **`server-deploy.sh`** - Lives on your server permanently
2. **`deploy.sh`** - Pulled from git repository for each deployment
3. **`.env`** - Server-specific configuration (stays on server)

## Server Setup (One-time)

### 1. Copy the bootstrap script to your server

```bash
# Copy server-deploy.sh to your server
scp server-deploy.sh user@your-server:/opt/banking-app/
scp .env user@your-server:/opt/banking-app/
```

### 2. Make it executable

```bash
# On your server
ssh user@your-server
cd /opt/banking-app
chmod +x server-deploy.sh
```

### 3. Configure your server environment

Edit `/opt/banking-app/.env` with your server-specific settings:

```bash
# Industry Configuration
INDUSTRY_VERTICAL=banking
DEPLOY_CONTAINER_PREFIX=banking
DEPLOY_SITE_PORT=3000

# Database Configuration
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/banking

# Application Environment
NODE_ENV=production

# Add your other production environment variables...
```

## Deployment (Every Release)

### From your local machine:

```bash
# Deploy a specific tag to your server
ssh user@your-server "cd /opt/banking-app && ./server-deploy.sh v0.6.2-test"
```

### Or directly on the server:

```bash
# SSH to your server
ssh user@your-server

# Run the deployment
cd /opt/banking-app
./server-deploy.sh v0.6.2-test
```

## How It Works

1. **Bootstrap script** (`server-deploy.sh`) pulls the specified git tag
2. **Latest `deploy.sh`** is automatically used from the repository
3. **Your server `.env`** is copied to the release directory
4. **Deployment runs** with the latest deployment logic
5. **Symlink updated** to point to the new release

## Directory Structure

```
/opt/banking-app/
├── server-deploy.sh          # Bootstrap script (permanent)
├── .env                      # Server environment (permanent)
├── current -> releases/v0.6.2-test/  # Symlink to current release
└── releases/
    ├── v0.6.1-test/         # Previous release
    └── v0.6.2-test/         # Current release
        ├── deploy.sh        # From git
        ├── .env             # Copied from server
        ├── docker-compose.yml
        └── ... (all app files)
```

## Benefits

✅ **Always use latest deployment logic** from git repository  
✅ **Server environment stays on server** (no manual copying)  
✅ **Easy rollbacks** by deploying previous tags  
✅ **Clean releases directory** with version history  
✅ **No manual script updates** on server

## Rollback

To rollback to a previous version:

```bash
# Deploy any previous tag
./server-deploy.sh v0.6.1-test
```

## Monitoring

Check deployment status:

```bash
# Check running containers
cd /opt/banking-app/current
docker-compose ps

# Check application logs
docker-compose logs -f

# Check database status
./manage-shared-db.sh status
```
