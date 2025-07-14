import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("Test API: Starting database test");
    
    // Test basic database connection
    const forms = await db.form.findMany({
      take: 5,
      include: {
        datas: true,
        fields: true,
      },
    });

    console.log("Test API: Found forms", { count: forms.length });

    const users = await db.user.findMany({
      take: 5,
    });

    console.log("Test API: Found users", { count: users.length });

    const response = NextResponse.json({
      success: true,
      forms: forms.map(f => ({
        id: f.id,
        topic: f.topic,
        type: f.type,
        userId: f.userId,
        dataCount: f.datas?.length || 0,
        fieldCount: f.fields?.length || 0
      })),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name
      }))
    });
    
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("Test API error:", error);
    const response = NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 