#!/bin/sh

# Multi-tenant database initialization script
# This ensures the industry-specific database and customer table exists before starting the app

echo "🚀 Starting multi-tenant database setup..."

# Get the industry vertical from environment (defaults to 'banking')
VERTICAL=${INDUSTRY_VERTICAL:-banking}
echo "📊 Industry vertical: $VERTICAL"

# Verify DATABASE_URL is set and points to correct database
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

# Extract database name from URL to verify it matches the expected pattern
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
EXPECTED_DB_NAME="${VERTICAL}"

echo "📊 Database connection:"
echo "   Expected database: $EXPECTED_DB_NAME"
echo "   Configured database: $DB_NAME"

if [ "$DB_NAME" != "$EXPECTED_DB_NAME" ]; then
  echo "⚠️  WARNING: Database name ($DB_NAME) doesn't match expected pattern ($EXPECTED_DB_NAME)"
  echo "   Make sure DATABASE_URL points to the correct industry-specific database"
fi

# Run the database setup
echo "🔧 Ensuring ${VERTICAL} database and customer table exists..."
node scripts/setup-database.js

echo "🎯 Starting application..."
exec "$@"
