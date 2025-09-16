import { NextRequest, NextResponse } from "next/server"
import { getIndustryPrismaClient } from "@/lib/database-setup"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Email, password, first name, and last name are required" }, { status: 400 })
    }

    // Get industry-specific Prisma client
    const vertical = process.env.INDUSTRY_VERTICAL || "banking"
    const prisma = await getIndustryPrismaClient(vertical)

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.customer.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
      },
    })

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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
