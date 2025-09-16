#!/bin/bash
set -e

TAG=$1
ENVIRONMENT=${2:-"local"}  # Default to local for testing

# Special case: if TAG is "local" or "dev", skip git operations
LOCAL_ONLY=false
if [ "$TAG" = "local" ] || [ "$TAG" = "dev" ] || [ "$TAG" = "current" ]; then
    LOCAL_ONLY=true
    TAG="local-dev"
    ENVIRONMENT="local"
fi

# Load environment variables from .env file 
if [ -f ".env" ]; then
    set -a  # automatically export all variables
    source .env
    set +a  # stop automatically exporting
    echo "✅ Loaded environment from .env file"
    echo "🔍 Key variables: DEPLOY_CONTAINER_PREFIX=$DEPLOY_CONTAINER_PREFIX, DEPLOY_SITE_PORT=$DEPLOY_SITE_PORT"
else
    echo "❌ No .env file found. Please create one from .env.multitenant.example"
    exit 1
fi

# Multi-tenant deployment configuration
case $ENVIRONMENT in
  "local"|"dev"|"development")
    echo "🏠 Local multi-tenant deployment"
    # Use current directory for local development
    DEPLOY_DIR="$(pwd)"
    PROJECT_NAME="banking-multitenant-local"
    ;;
  "production"|"prod"|"server")
    echo "🌐 Server multi-tenant deployment"
    # For server deployment, allow custom base directory
    BASE_DIR="${DEPLOY_BASE_DIR:-/opt/${DEPLOY_CONTAINER_PREFIX}-app}"
    RELEASES_DIR="$BASE_DIR/releases"
    DEPLOY_DIR="$RELEASES_DIR/$TAG"
    CURRENT_LINK="$BASE_DIR/current"
    PROJECT_NAME="banking-multitenant"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "Valid environments: local, production"
    exit 1
    ;;
esac

if [ -z "$TAG" ]; then
  echo "Usage: $0 <tag> [environment]"
  echo "Example: $0 v1.0.0 local"
  echo "Example: $0 v1.0.0 production"
  echo "Example: $0 local          # Local development (no git fetch)"
  echo "Example: $0 dev            # Local development (no git fetch)"
  echo ""
  echo "Environments:"
  echo "  local       - Deploy in current directory"
  echo "  production  - Deploy to server with releases"
  echo ""
  echo "Special tags for local development:"
  echo "  local, dev, current - Skip git operations, use current code"
  echo ""
  echo "Current configuration:"
  echo "  Industry: $INDUSTRY_VERTICAL"
  echo "  Port: $DEPLOY_SITE_PORT"
  echo "  Container: $DEPLOY_CONTAINER_PREFIX"
  exit 1
fi

echo "🚀 Multi-Tenant Deployment: $TAG ($ENVIRONMENT)"
if [ "$LOCAL_ONLY" = true ]; then
    echo "🔧 Local Development Mode (no git operations)"
fi
echo "🏢 Industry Vertical: $INDUSTRY_VERTICAL"
echo "🐳 Container Prefix: $DEPLOY_CONTAINER_PREFIX"
echo "🌐 Port: $DEPLOY_SITE_PORT"
echo ""

# Step 1: Ensure shared PostgreSQL database is running
echo "🐘 Step 1: Ensuring shared PostgreSQL database..."
# For server deployments, the database is already handled by server-deploy.sh
if [ "$ENVIRONMENT" = "local" ] || [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
    if ! ./manage-shared-db.sh start; then
        echo "❌ Failed to start shared database"
        exit 1
    fi
else
    echo "✅ Database handled by server bootstrap script"
fi

# Step 1.5: Ensure industry-specific database exists
echo "🏗️  Step 1.5: Ensuring industry database '$INDUSTRY_VERTICAL' exists..."
if docker exec shared-postgres-multitenant psql -U multitenant_user -d postgres -lqt | cut -d \| -f 1 | grep -qw "$INDUSTRY_VERTICAL"; then
    echo "✅ Database '$INDUSTRY_VERTICAL' already exists"
else
    echo "🔨 Creating database '$INDUSTRY_VERTICAL'..."
    docker exec shared-postgres-multitenant psql -U multitenant_user -d postgres -c "CREATE DATABASE \"$INDUSTRY_VERTICAL\";"
    echo "✅ Database '$INDUSTRY_VERTICAL' created successfully"
fi

# Step 2: Handle environment-specific deployment
if [ "$ENVIRONMENT" = "local" ] || [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
    # Local deployment - use current directory
    echo "🏠 Step 2: Local deployment in current directory"
    
    # Stop any existing containers for this industry
    echo "🛑 Stopping existing containers..."
    docker-compose down 2>/dev/null || true
    
    # Clean up any orphaned containers with our prefix - more thorough cleanup
    echo "🧹 Cleaning up orphaned containers..."
    docker rm -f "${DEPLOY_CONTAINER_PREFIX}-app" 2>/dev/null || true
    
    # Also check for any containers using the same image name
    if docker ps -a --filter "name=${DEPLOY_CONTAINER_PREFIX}-app" --format "{{.Names}}" | grep -q "${DEPLOY_CONTAINER_PREFIX}-app"; then
        echo "🔧 Found existing containers with same name, forcing removal..."
        docker ps -a --filter "name=${DEPLOY_CONTAINER_PREFIX}-app" --format "{{.Names}}" | xargs -r docker rm -f
    fi
    
    # Build and start the application
    echo "🚀 Building and starting $INDUSTRY_VERTICAL application..."
    docker compose up -d --build
    
else
    # Production deployment - assume we're already in the correct release directory
    echo "🌐 Step 2: Production deployment"
    echo "📁 Working in: $(pwd)"
    
    # Stop current containers if they exist
    echo "🛑 Stopping current containers..."
    docker compose down 2>/dev/null || true
    
    # Clean up any orphaned containers with our prefix - more thorough cleanup
    echo "🧹 Cleaning up orphaned containers..."
    docker rm -f "${DEPLOY_CONTAINER_PREFIX}-app" 2>/dev/null || true
    
    # Also check for any containers using the same image name
    if docker ps -a --filter "name=${DEPLOY_CONTAINER_PREFIX}-app" --format "{{.Names}}" | grep -q "${DEPLOY_CONTAINER_PREFIX}-app"; then
        echo "🔧 Found existing containers with same name, forcing removal..."
        docker ps -a --filter "name=${DEPLOY_CONTAINER_PREFIX}-app" --format "{{.Names}}" | xargs -r docker rm -f
    fi
    echo "🏗️ Building and starting $INDUSTRY_VERTICAL application..."
    docker compose up -d --build
fi

# Step 3: Verify deployment
echo ""
echo "✅ Multi-tenant deployment complete!"
echo "🏢 Industry: $INDUSTRY_VERTICAL"
echo "🌐 URL: http://localhost:$DEPLOY_SITE_PORT"
echo "🗄️  Database: $INDUSTRY_VERTICAL database on shared PostgreSQL"
echo ""

# Show container status
echo "🔍 Container Status:"
docker compose ps

echo ""
echo "📋 Quick Commands:"
echo "  View logs: docker compose logs -f"
echo "  Stop app: docker compose down"
echo "  DB status: ./manage-shared-db.sh status"
echo "  DB logs: ./manage-shared-db.sh logs"

