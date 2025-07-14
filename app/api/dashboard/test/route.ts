import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("[Dashboard Test] Starting test request...");
    
    // Test 1: Check if auth works
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[Dashboard Test] Session found:", !!session);
    console.log("[Dashboard Test] User ID:", session?.user?.id);
    
    if (!session?.user?.id) {
      const response = NextResponse.json({ error: "No session" }, { status: 401 });
    return addCorsHeaders(response, request as NextRequest);
    }

    // Test 2: Check if database connection works
    console.log("[Dashboard Test] Testing database connection...");
    const userCount = await db.user.count();
    console.log("[Dashboard Test] Total users in DB:", userCount);

    // Test 3: Check if we can query forms
    console.log("[Dashboard Test] Testing forms query...");
    const forms = await db.form.findMany({
      where: { userId: session.user.id },
      select: { id: true, topic: true, _count: { select: { datas: true } } }
    });
    console.log("[Dashboard Test] Forms found:", forms.length);
    console.log("[Dashboard Test] Forms:", forms);

    // Test 4: Check if we can query datas
    console.log("[Dashboard Test] Testing datas query...");
    const datasCount = await db.data.count();
    console.log("[Dashboard Test] Total datas in DB:", datasCount);

    const response = NextResponse.json({
      success: true,
      user: session.user.id,
      formsCount: forms.length,
      totalDatas: datasCount,
      forms: forms
    });
    return addCorsHeaders(response, request as NextRequest);

  } catch (error) {
    console.error("[Dashboard Test] Error:", error);
    console.error("[Dashboard Test] Error stack:", error instanceof Error ? error.stack : "No stack");
    const response = NextResponse.json(
      { 
        error: "Test failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
    return addCorsHeaders(response, request as NextRequest);
  }
}; 