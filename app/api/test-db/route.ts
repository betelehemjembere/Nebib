import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("🔍 Debugging all forms in database...")

    // Get all forms with their basic info
    const allForms = await db.form.findMany({
      select: {
        id: true,
        topic: true,
        description: true,
        createdAt: true,
        status: true,
      },
      take: 10, // Limit to first 10 forms
    })

    console.log("📊 Total forms found:", allForms.length)
    console.log("📋 Forms:", allForms)

    // Also get the count
    const totalCount = await db.form.count()

    const response = NextResponse.json({
      success: true,
      totalCount,
      forms: allForms,
      message: `Found ${allForms.length} forms in database`,
    });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 Debug forms error:", error)
    const response = NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
    return addCorsHeaders(response, request);
  }
}
