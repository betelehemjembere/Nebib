// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

export function addCorsHeaders(response: NextResponse, request: NextRequest) {
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
    // Fallback for requests without origin (like mobile apps or direct API calls)
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

export function createCorsResponse(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, request);
}
