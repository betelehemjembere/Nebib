import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request, context: { params: Promise<{ formId: string }> }) => {
  try {
    const { formId } = await context.params

    console.log("🔍 Public API - Looking for form with ID:", formId)
    console.log("📋 Public API - Request URL:", request.url)

    if (!formId) {
      const response = NextResponse.json({ error: "Form ID is required" }, { status: 400 });
      return addCorsHeaders(response, request as NextRequest);
    }

    // Find the form by ID and include fields (no authentication required)
    const form = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        fields: true,
      },
    })

    if (!form) {
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 });
      return addCorsHeaders(response, request as NextRequest);
    }

    console.log("✅ Public form fetched successfully")

    const response = NextResponse.json(form, { status: 200 });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.error("[PUBLIC_FORM_FETCH_ERROR]", error)
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
} 