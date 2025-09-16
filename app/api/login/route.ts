import { NextRequest, NextResponse } from "next/server"
import { getIndustryPrismaClient } from "@/lib/database-setup"
// import bcrypt from "bcryptjs" // Disabled for testing

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get industry-specific Prisma client
    const vertical = process.env.INDUSTRY_VERTICAL || "banking"
    const prisma = await getIndustryPrismaClient(vertical)

    // Find user by email
    const user = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password - DISABLED FOR TESTING
    // const isValidPassword = await bcrypt.compare(password, user.password)

    // if (!isValidPassword) {
    //   return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    // }

    // Skip password validation for testing purposes
    console.log("⚠️  Password validation DISABLED - accepting any password for testing")

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    }

    await prisma.$disconnect()
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        consoleError: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
