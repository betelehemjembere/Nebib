import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const response = NextResponse.json({ success: true });
  return addCorsHeaders(response, request);
}
