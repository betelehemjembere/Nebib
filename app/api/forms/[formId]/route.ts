import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCorsHeaders } from "@/lib/cors";
import { Type } from "@prisma/client";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

// GET - Get a specific form
export const GET = async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    const { formId } = await params;
    console.log("🔍 Forms API: Starting GET request for form:", formId);
    
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    
    if (!session) {
      console.log("❌ Forms API: No session found - returning unauthorized");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    const form = await db.form.findFirst({
      where: {
        id: formId,
        userId: session.user.id,
      },
      include: {
        fields: true,
        datas: true,
      },
    });

    if (!form) {
      console.log("❌ Forms API: Form not found or unauthorized");
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    console.log("✅ Forms API: Form retrieved successfully");
    const response = NextResponse.json(form);
    return addCorsHeaders(response, request);
    
  } catch (error) {
    console.error("🚨 Forms API Error:", error);
    const response = NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
};

// PUT - Update a form
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    const { formId } = await params;
    console.log("🔍 Forms API: Starting PUT request for form:", formId);
    
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    
    if (!session) {
      console.log("❌ Forms API: No session found - returning unauthorized");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    const body = await request.json();
    const { topic, description, categories, fields } = body;

    // Validate required fields
    if (!topic || !description) {
      const response = NextResponse.json(
        { error: "Topic and description are required" },
        { status: 400 }
      );
      return addCorsHeaders(response, request);
    }

    // Check if form exists and belongs to user
    const existingForm = await db.form.findFirst({
      where: {
        id: formId,
        userId: session.user.id,
      },
    });

    if (!existingForm) {
      console.log("❌ Forms API: Form not found or unauthorized");
      const response = NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    console.log("💾 Forms API: Updating form with data:", {
      topic,
      description,
      categories: categories ? categories.join(',') : '',
      fieldsCount: fields?.length || 0
    });

    // Update the form
    const updatedForm = await db.form.update({
      where: {
        id: formId,
      },
      data: {
        topic,
        description,
        categories: categories ? categories.join(',') : '',
        updatedAt: new Date(),
      },
      include: {
        fields: true,
        datas: true,
      },
    });

    // Update fields if provided
    if (fields && Array.isArray(fields)) {
      // Delete existing fields
      await db.field.deleteMany({
        where: {
          formId: formId,
        },
      });

      // Create new fields
      await db.field.createMany({
        data: fields.map((field: any) => ({
          formId: formId,
          label: field.label,
          type: field.type,
          category: field.category || '',
          required: field.required || false,
        })),
      });

      // Fetch updated form with new fields
      const finalForm = await db.form.findFirst({
        where: {
          id: formId,
        },
        include: {
          fields: true,
          datas: true,
        },
      });

      console.log("✅ Forms API: Form updated successfully");
      const response = NextResponse.json(finalForm);
      return addCorsHeaders(response, request);
    }

    console.log("✅ Forms API: Form updated successfully");
    const response = NextResponse.json(updatedForm);
    return addCorsHeaders(response, request);
    
  } catch (error) {
    console.error("🚨 Forms API Error:", error);
    const response = NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
};

// DELETE - Delete a form
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    const { formId } = await params;
    console.log("🔍 Forms API: Starting DELETE request for form:", formId);
    
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    
    if (!session) {
      console.log("❌ Forms API: No session found - returning unauthorized");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    // Check if form exists and belongs to user
    const existingForm = await db.form.findFirst({
      where: {
        id: formId,
        userId: session.user.id,
      },
      include: {
        fields: true,
        datas: true,
        attendances: true,
      },
    });

    if (!existingForm) {
      console.log("❌ Forms API: Form not found or unauthorized");
      const response = NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    console.log("🗑️ Forms API: Deleting form and related data");
    console.log("📊 Forms API: Related data to delete:", {
      fieldsCount: existingForm.fields.length,
      datasCount: existingForm.datas.length,
      attendancesCount: existingForm.attendances.length
    });

    // Delete the form (cascade will handle related data)
    await db.form.delete({
      where: {
        id: formId,
      },
    });

    console.log("✅ Forms API: Form deleted successfully");
    const response = NextResponse.json({ 
      success: true, 
      message: "Form deleted successfully",
      deletedForm: {
        id: existingForm.id,
        topic: existingForm.topic,
        fieldsCount: existingForm.fields.length,
        datasCount: existingForm.datas.length,
        attendancesCount: existingForm.attendances.length
      }
    });
    return addCorsHeaders(response, request);
    
  } catch (error) {
    console.error("🚨 Forms API Error:", error);
    const response = NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
}; 