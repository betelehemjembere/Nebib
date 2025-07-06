import { db } from "@/lib/db";
import getSession from "@/lib/get-session-user";
import { NextResponse } from "next/server";

export const GET = async function () {
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
