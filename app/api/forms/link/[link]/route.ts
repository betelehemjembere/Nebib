import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request, { params }: { params: Promise<{ formid: string }> }) => {
  try {
    // In Next.js 15+, params is a Promise that needs to be awaited
    const { formid } = await params
    const formId = formid

    console.log("🔍 Looking for public form with ID:", formId)

    if (!formId) {
      const response = NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    return addCorsHeaders(response, request as NextRequest);
    }

    // Find the form by ID and include fields
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

    console.log("Public form fetched: ", form)

    const response = NextResponse.json(form, { status: 200 });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.error("[PUBLIC_FORM_FETCH_ERROR]", error)
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
}
