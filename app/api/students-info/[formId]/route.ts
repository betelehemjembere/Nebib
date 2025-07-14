import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";

// Type for params
// GET and POST use formId from params, PUT/DELETE use studentId from body

type GetParams = Promise<{ formId: string }>;

// GET: List all students for a form

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const studentsData = await db.form.findUnique({
      where: { id: formId },
      include: { datas: true, fields: true },
    });
    const response = NextResponse.json(studentsData);
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const response = NextResponse.json({ message: error.message }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
    }
    const response = NextResponse.json("server error", { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
};

// POST: Add a new student (Data row)
export const POST = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { data: {...} }
    const newStudent = await db.data.create({
      data: {
        formId,
        data: body.data,
      },
    });
    const response = NextResponse.json(newStudent, { status: 201 });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const response = NextResponse.json({ message: error.message }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
    }
    const response = NextResponse.json("server error", { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
};

// PUT: Update a student (Data row)
export const PUT = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { studentId, data }
    const updatedStudent = await db.data.update({
      where: { id: body.studentId, formId },
      data: { data: body.data },
    });
    const response = NextResponse.json(updatedStudent);
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const response = NextResponse.json({ message: error.message }, { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
    }
    const response = NextResponse.json("server error", { status: 500 });
    return addCorsHeaders(response, request as NextRequest);
  }
};

// DELETE: Remove a student (Data row)
export const DELETE = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { studentId }
    await db.data.delete({
      where: { id: body.studentId, formId },
    });
    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const response = NextResponse.json({ message: error.message }, { status: 500 });
        return addCorsHeaders(response, request as NextRequest);
    }
    const response = NextResponse.json
    
  }
};
