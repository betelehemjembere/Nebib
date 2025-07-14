import { NextRequest, NextResponse } from 'next/server';

export function addCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Allow specific origins in production, or all in development
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        'https://nebib-forms-production-c7f6.up.railway.app', // Replace with your actual domain
        'https://www.nebibs.com', // Replace with your actual domain
        'http://localhost:3000', // For local development
        'http://localhost:3001', // For local development
      ]
    : ['*'];

  const isAllowedOrigin = allowedOrigins.includes('*') || 
    (origin && allowedOrigins.includes(origin));

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

export function createCorsResponse(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, request);
} 