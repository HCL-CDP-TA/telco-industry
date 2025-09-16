# Multi-Tenant Setup Guide

This guide helps you set up the shared database infrastructure that all industry projects can use.

## Quick Start

1. **Copy Required Files to All Industry Projects:**

   ```bash
   # Copy these files to banking, insurance, telecom project folders:
   - docker-compose.shared-db.yml
   - manage-shared-db.sh
   - .env.shared-db.example
   - init-shared-db.sql
   - SETUP_GUIDE.md (this file)
   ```

2. **Configure Shared Database:**

   ```bash
   # In each project folder:
   cp .env.shared-db.example .env.shared-db
   # Edit .env.shared-db with your preferred credentials
   ```

3. **Start Shared Database:**

   ```bash
   # Run this in any project folder (only needs to be done once):
   ./manage-shared-db.sh start
   ```

4. **Configure Industry-Specific Environment:**

   ```bash
   # Banking project:
   INDUSTRY_VERTICAL=banking
   DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/banking

   # Insurance project:
   INDUSTRY_VERTICAL=insurance
   DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/insurance

   # Telecom project:
   INDUSTRY_VERTICAL=telcom
   DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/telcom
   ```

## File Structure

```
industry-project/
├── docker-compose.yml                 # Main app compose (updated for multitenant)
├── docker-compose.shared-db.yml       # Shared PostgreSQL service ⭐ COPY THIS
├── manage-shared-db.sh                # Database management script ⭐ COPY THIS
├── .env.shared-db.example             # Shared DB config template ⭐ COPY THIS
├── .env.multitenant.example           # Industry-specific config
├── init-shared-db.sql                 # DB initialization script ⭐ COPY THIS
├── SETUP_GUIDE.md                     # This file ⭐ COPY THIS
└── lib/database-setup.ts              # Updated for container management
```

## Commands Reference

### Shared Database Management

```bash
# Start shared PostgreSQL (run once, from any project)
./manage-shared-db.sh start

# Check status
./manage-shared-db.sh status

# View logs
./manage-shared-db.sh logs

# Stop shared database
./manage-shared-db.sh stop

# Remove shared database (DESTRUCTIVE)
./manage-shared-db.sh remove
```

### Industry Deployment

```bash
# Deploy banking app (creates banking database automatically)
INDUSTRY_VERTICAL=banking docker-compose up -d

# Deploy insurance app (creates insurance database automatically)
INDUSTRY_VERTICAL=insurance docker-compose up -d

# Deploy telecom app (creates telcom database automatically)
INDUSTRY_VERTICAL=telcom docker-compose up -d
```

## Database Structure Result

```
Shared PostgreSQL Container (shared-postgres-multitenant)
├── banking
│   └── customer table
├── insurance
│   └── customer table
└── telcom
    └── customer table
```

## Troubleshooting

### Container Management Issues

1. **Docker socket permission denied:**

   ```bash
   # Make sure Docker is running and user has permissions
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

2. **Shared database won't start:**

   ```bash
   # Check if port 5432 is already in use
   lsof -i :5432

   # Or change port in .env.shared-db
   POSTGRES_PORT=5433
   ```

3. **Database creation fails:**

   ```bash
   # Check container logs
   ./manage-shared-db.sh logs

   # Verify connection
   docker exec -it shared-postgres-multitenant psql -U multitenant_user -d postgres
   ```

### Application Issues

1. **Can't connect to database:**

   - Verify shared database is running: `./manage-shared-db.sh status`
   - Check DATABASE_URL format matches container name
   - Ensure app container is on same network

2. **Table not found:**
   - Database setup should run automatically on app start
   - Check logs for database creation errors
   - Run database setup manually: `node scripts/setup-database.js`

## Migration from Single-Tenant

1. **Export existing data:**

   ```bash
   pg_dump your_old_database > industry_data.sql
   ```

2. **Start shared database:**

   ```bash
   ./manage-shared-db.sh start
   ```

3. **Import data to industry database:**

   ```bash
   # The app will create the industry database automatically
   # Then import your data:
   docker exec -i shared-postgres-multitenant psql -U multitenant_user -d banking < industry_data.sql
   ```

4. **Update deployment:**
   - Copy multitenant files to project
   - Update docker-compose.yml
   - Update .env with new DATABASE_URL
   - Deploy: `docker-compose up -d`

## Security Notes

- Change default passwords in `.env.shared-db`
- Use proper network isolation for production
- Consider SSL connections for production deployments
- Backup shared database regularly

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review container logs: `./manage-shared-db.sh logs`
3. Verify network connectivity between containers
4. Ensure all required files are copied to project folder
