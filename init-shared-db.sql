-- Initialize shared PostgreSQL instance for multi-tenant deployment
-- This script runs once when the PostgreSQL container is first created

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a shared user for all industry applications (if different from default)
-- DO $$ 
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'industry_app') THEN
--     CREATE ROLE industry_app LOGIN PASSWORD 'industry_app_password';
--   END IF;
-- END
-- $$;

-- Grant necessary permissions
-- GRANT CREATE ON DATABASE postgres TO industry_app;

-- Log initialization
SELECT 'Shared PostgreSQL instance initialized for multi-tenant deployment' AS status;
