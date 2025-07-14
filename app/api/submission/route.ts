import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { addCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async function (request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("Received data:", body);

    if (!body.data) {
      throw new Error("no data is given to the server");
    }

    if (!body.formId) {
      throw new Error("Form Id is missing");
    }

    console.log({ data: body.data, formId: body.formId });

    const submission = await db.data.create({
      data: {
        data: body.data,
        formId: body.formId,
      },
    });

    const response = NextResponse.json(submission, { status: 201 });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const response = NextResponse.json({ message: error.message }, { status: 500 });
      return addCorsHeaders(response, request);
    }
    const response = NextResponse.json("server error", { status: 500 });
    return addCorsHeaders(response, request);
  }
};
