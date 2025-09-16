#!/bin/bash
set -e

echo "🔍 Checking database connection..."

# Extract connection details from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "📡 Connecting to database at $DB_HOST:$DB_PORT"

# Wait for database to be ready
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "⏳ Waiting for database to be ready..."
  sleep 2
done

echo "✅ Database is ready!"

# Check if customer table exists to determine if this is a fresh database
CUSTOMER_EXISTS=$(PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer');" 2>/dev/null || echo "f")

if [ "$CUSTOMER_EXISTS" = "t" ]; then
  echo "📋 Database tables exist - checking migration status..."
  
  # Check migration status and resolve any failed migrations
  MIGRATION_STATUS=$(npx prisma migrate status 2>&1 || true)
  echo "$MIGRATION_STATUS"
  
  # Check if there are any failed migrations
  if echo "$MIGRATION_STATUS" | grep -q "Following migration have failed"; then
    echo "🔧 Found failed migrations - resolving them as applied..."
    
    # Check specifically for the init migration we know about
    if echo "$MIGRATION_STATUS" | grep -q "20250620005134_init"; then
      echo "🔧 Resolving migration: 20250620005134_init"
      npx prisma migrate resolve --applied "20250620005134_init" || true
    fi
    
    echo "✅ Migration resolution attempted"
    
    # Verify migration status again
    echo "🔍 Checking migration status after resolution..."
    npx prisma migrate status || true
  else
    echo "✅ All migrations are in good state"
  fi
  echo "ℹ️ Skipping migration deployment to preserve existing data"
else
  echo "🔄 Fresh database detected - running Prisma migrations..."
  npx prisma migrate deploy
fi

echo "🚀 Starting application..."
exec "$@"
