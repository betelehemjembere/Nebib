import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"
import { auth } from "@/lib/auth"

type RouteParams = {
  id: string
}


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request, context: { params: Promise<RouteParams> }) => {
  try {
    // Await the params promise
    const { id: formId } = await context.params

    console.log("🔍 API - Looking for form with ID:", formId)
    console.log("📋 API - Request URL:", request.url)

    if (!formId) {
      const response = NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    return addCorsHeaders(response, request as NextRequest);
    }

    // Check authentication
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Session result:", session ? "Found" : "Not found")
    
    if (!session) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return addCorsHeaders(response, request as NextRequest);
    }

    // Find the form by ID and include fields and submissions
    const form = await db.form.findUnique({
      where: {
        id: formId,
        userId: session.user.id, // Only allow access to user's own forms
      },
      include: {
        fields: true,
        datas: true, // Include submissions
      },
    })

    if (!form) {
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 });
    return addCorsHeaders(response, request as NextRequest);
    }

    console.log("✅ Form fetched successfully")

    const response = NextResponse.json(form, { status: 200 });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.error("[FORM_FETCH_ERROR]", error)
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
}
