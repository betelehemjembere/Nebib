import { db } from "@/lib/db";
import getSession from "@/lib/get-session-user";
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async function (request: NextRequest) {
  try {
    const session = await getSession();

    console.log(
      "**********************************************",
      session?.user,
      "************************************************"
    );

    const forms = await db.form.findMany({
      where: { userId: session?.session.userId },
      include: { 
        fields: true,
        datas: true, // Include submissions
      },
    });
    console.log(forms);

    return new Response(JSON.stringify(forms), { status: 200 });
  } catch (error) {
    console.error("[FORMS_FETCH_ERROR]", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
};
