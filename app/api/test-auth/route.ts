import { auth } from "@/lib/auth"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request) => {
  try {
    console.log("🔍 Testing auth...")
    console.log("🍪 Cookies:", request.headers.get("cookie"))
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Session:", session ? "Found" : "Not found")
    
    if (session) {
      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        }
      });
    return addCorsHeaders(response, request as NextRequest);
    } else {
      const response = NextResponse.json({
        authenticated: false,
        message: "No session found"
      });
    return addCorsHeaders(response, request as NextRequest);
    }
  } catch (error) {
    console.error("🚨 Auth test error:", error)
    const response = NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return addCorsHeaders(response, request as NextRequest);
  }
} 