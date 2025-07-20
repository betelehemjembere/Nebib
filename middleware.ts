import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://nebib-forms-production-c7f6.up.railway.app',
      'https://nebib-forms-production.up.railway.app',
      'https://nebib-production.up.railway.app',
      'https://www.nebibs.com',
      'https://nebibs.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://10.77.185.88:3000',
      'https://10.77.185.88:3000'
    ];

    // For deployment, be more permissive with CORS
    const isAllowedOrigin = origin && (
      allowedOrigins.includes(origin) || 
      origin.includes('railway.app') ||
      origin.includes('nebibs.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    );

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      // Fallback for requests without origin
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name'
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // Skip authentication for sign-in, register, and auth-related pages
  if (
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/register' ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next();
  }

  // Handle authentication for protected routes
  try {
    console.log("🔍 Middleware: Checking session for URL:", request.url);
    console.log("🍪 Middleware: All cookies:", request.headers.get("cookie"));
    
    // Check for better-auth specific cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    console.log("🍪 Middleware: Parsed cookies:", Object.keys(cookies));
    console.log("🍪 Middleware: Better-auth session cookie:", cookies['better-auth.session_token']);
    
    // Check if we have a better-auth session cookie
    if (!cookies['better-auth.session_token']) {
      console.log("❌ Middleware: No better-auth session cookie found, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    console.log("✅ Middleware: Session cookie found, proceeding");
    return NextResponse.next();
  } catch (err) {
    console.error("🚨 Middleware error:", err);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/api/(.*)",
    "/form-generator(.*)", 
    "/form-management(.*)", 
    "/generate-form(.*)",
    "/dashboard(.*)",
    "/attendance-management(.*)",
    "/settings(.*)"
  ],
};
