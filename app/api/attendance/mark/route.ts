import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return addCorsHeaders(response, request);
    }
    const { formId, studentId, date, status } = await request.json();
    if (!formId || !studentId || !date || !status) {
      const response = NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    return addCorsHeaders(response, request);
    }
    // Find the Data record for this student/date/form
    let dataRecord = await db.data.findFirst({
      where: {
        formId,
        id: studentId,
      },
    });
    if (!dataRecord) {
      // If not found, create a new Data record
      dataRecord = await db.data.create({
        data: {
          id: studentId,
          formId,
          data: { status, date },
        },
      });
    } else {
      // If found, update the data field (append or update attendance for the date)
      let newData = { ...(dataRecord.data as any) };
      newData.status = status;
      newData.date = date;
      await db.data.update({
        where: { id: dataRecord.id },
        data: { data: newData },
      });
    }
    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("Attendance mark error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addCorsHeaders(response, request);
  }
}; 