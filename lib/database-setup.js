import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const prisma = new PrismaClient()

export async function ensureSharedPostgreSQL() {
  // When running inside a container, we assume the shared PostgreSQL is already running
  // and managed externally by Docker Compose
  if (process.env.NODE_ENV === "production" || process.env.DOCKER_CONTAINER) {
    console.log("🐘 Running in container - assuming shared PostgreSQL is externally managed")
    return
  }

  try {
    console.log("🐘 Ensuring shared PostgreSQL container is available...")

    // Check if shared PostgreSQL container is running
    try {
      const { stdout } = await execAsync('docker ps --format "table {{.Names}}" | grep shared-postgres-multitenant')
      if (stdout.trim()) {
        console.log("✅ Shared PostgreSQL container is already running")
        return
      }
    } catch {
      // Container not running, try to start it
    }

    console.log("🚀 Starting shared PostgreSQL container...")

    // Try to start the shared database using the management script
    try {
      await execAsync("./manage-shared-db.sh start")
      console.log("✅ Shared PostgreSQL container started successfully")
    } catch {
      console.log("⚠️  Management script not found, trying Docker Compose directly...")

      // Fallback: try to start with docker compose directly
      try {
        await execAsync("docker compose -f docker-compose.shared-db.yml up -d shared-postgres")
        console.log("✅ Shared PostgreSQL container started via Docker Compose")
      } catch (composeError) {
        console.error("❌ Failed to start shared PostgreSQL container")
        console.error("Please ensure:")
        console.error("  1. Docker is running")
        console.error("  2. docker-compose.shared-db.yml exists")
        console.error("  3. .env.shared-db is configured")
        console.error("  4. Run './manage-shared-db.sh start' manually")
        throw composeError
      }
    }

    // Wait a moment for the container to fully start
    await new Promise(resolve => setTimeout(resolve, 5000))
  } catch (error) {
    console.error("❌ Error ensuring shared PostgreSQL:", error)
    throw error
  }
}

export async function ensureIndustryDatabase(vertical = "banking") {
  const databaseName = vertical

  try {
    // First ensure the shared PostgreSQL container is running
    await ensureSharedPostgreSQL()

    // Check if database exists
    const result = await prisma.$queryRaw`
      SELECT 1 FROM pg_database WHERE datname = ${databaseName}
    `

    const databaseExists = Array.isArray(result) && result.length > 0

    if (!databaseExists) {
      console.log(`Creating database: ${databaseName}`)

      // Create the industry-specific database
      await prisma.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`)

      console.log(`✅ Database ${databaseName} created successfully`)
    } else {
      console.log(`✅ Database ${databaseName} already exists`)
    }

    // Now ensure the customer table exists in the target database
    await ensureCustomerTable(vertical)
  } catch (error) {
    console.error(`❌ Error ensuring database ${databaseName}:`, error)
    throw error
  }
}

export async function ensureCustomerTable(vertical = "banking") {
  const databaseName = vertical

  try {
    // Create a new Prisma client connected to the industry-specific database
    const industryClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL?.replace(/\/[^\/]+$/, `/${databaseName}`) || "",
        },
      },
    })

    // Check if customer table exists
    const result = await industryClient.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'customer'
      );
    `

    const tableExists = result[0]?.exists

    if (!tableExists) {
      console.log(`Creating customer table in ${databaseName} using Prisma migrations...`)

      // Use Prisma migrations instead of manual table creation
      const { exec } = await import("child_process")
      const { promisify } = await import("util")
      const execAsync = promisify(exec)

      // Set the database URL for this specific database
      const industryDatabaseUrl = process.env.DATABASE_URL?.replace(/\/[^\/]+$/, `/${databaseName}`)

      // Run Prisma migration on the industry-specific database
      await execAsync(`DATABASE_URL="${industryDatabaseUrl}" npx prisma migrate deploy`)

      console.log(`✅ Customer table created successfully in ${databaseName} via Prisma migrations`)
    } else {
      console.log(`✅ Customer table already exists in ${databaseName}`)
    }

    await industryClient.$disconnect()
  } catch (error) {
    console.error(`❌ Error ensuring customer table in ${databaseName}:`, error)
    throw error
  }
}

export async function getIndustryPrismaClient(vertical = "banking") {
  const databaseName = vertical

  // Ensure the database and table exist
  await ensureIndustryDatabase(vertical)

  // Return a client connected to the industry-specific database
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.replace(/\/[^\/]+$/, `/${databaseName}`) || "",
      },
    },
  })
}
