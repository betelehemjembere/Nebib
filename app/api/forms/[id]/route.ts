import { db } from "@/lib/db"
import { NextResponse } from "next/server"

type RouteParams = {
  formId: string
}

export const GET = async (request: Request, context: { params: RouteParams }) => {
  try {
    // Direct access to params without awaiting
    const formId = context.params.formId

    console.log("🔍 Public API - Looking for form with ID:", formId)
    console.log("📋 Public API - Request URL:", request.url)

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
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
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    console.log("✅ Public form fetched successfully")

    return NextResponse.json(form, { status: 200 })
  } catch (error) {
    console.error("[PUBLIC_FORM_FETCH_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
