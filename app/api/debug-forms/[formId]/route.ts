import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debugging all forms in database...")

    // Test database connection first
    try {
      await db.$queryRaw`SELECT 1`
      console.log("✅ Database connection successful")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      const response = NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown DB error",
        },
        { status: 500 },
      )
      return addCorsHeaders(response, request);
    }

    // Get all forms with their basic info
    const allForms = await db.form.findMany({
      select: {
        id: true,
        topic: true,
        description: true,
        createdAt: true,
        status: true,
      },
      take: 20,
    })

    console.log("📊 Total forms found:", allForms.length)
    console.log("📋 Forms:", allForms)

    // Also get the count
    const totalCount = await db.form.count()

    // Check if the specific form ID exists
    const specificFormId = "cmc31wrhf0001qigsyh9t829w"
    const specificForm = await db.form.findUnique({
      where: { id: specificFormId },
      select: { id: true, topic: true, createdAt: true },
    })

    console.log(`🔍 Checking for specific form ${specificFormId}:`, specificForm ? "Found" : "Not found")

    const response = NextResponse.json({
      success: true,
      totalCount,
      forms: allForms,
      specificFormCheck: {
        formId: specificFormId,
        exists: !!specificForm,
        form: specificForm,
      },
      message: `Found ${allForms.length} forms in database`,
      timestamp: new Date().toISOString(),
    })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 Debug forms error:", error)
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
