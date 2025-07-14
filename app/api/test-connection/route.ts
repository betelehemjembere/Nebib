import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing database connection...")

    // Test basic connection
    await db.$queryRaw`SELECT 1 as test`
    console.log("✅ Database query successful")

    // Count forms
    const formCount = await db.form.count()
    console.log("📊 Form count:", formCount)

    // Get first form
    const firstForm = await db.form.findFirst({
      select: { id: true, topic: true },
    })
    console.log("📋 First form:", firstForm)

    const response = NextResponse.json({
      success: true,
      message: "Database connection successful",
      formCount,
      firstForm,
      timestamp: new Date().toISOString(),
    })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 Connection test failed:", error)
    const response = NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
    return addCorsHeaders(response, request);
  }
}
