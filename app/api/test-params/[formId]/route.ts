import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    console.log("🧪 Test Params - Request URL:", request.url)
    console.log("🧪 Test Params - Raw params:", params)

    // Extract URL parts manually as backup
    const url = new URL(request.url)
    const pathParts = url.pathname.split("/")
    const formIdFromPath = pathParts[pathParts.length - 1]

    console.log("🧪 Test Params - Path parts:", pathParts)
    console.log("🧪 Test Params - FormId from path:", formIdFromPath)

    // Await the params
    const resolvedParams = await params
    console.log("🧪 Test Params - Resolved params:", resolvedParams)

    const formId = resolvedParams?.formId
    console.log("🧪 Test Params - Extracted formId:", formId)

    const response = NextResponse.json({
      success: true,
      url: request.url,
      pathParts,
      formIdFromPath,
      rawParams: params,
      resolvedParams,
      extractedFormId: formId,
      comparison: {
        fromPath: formIdFromPath,
        fromParams: formId,
        match: formIdFromPath === formId,
      },
    });
    return addCorsHeaders(response, request as NextRequest);
  } catch (error) {
    console.error("🚨 Test Params Error:", error)
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
    return addCorsHeaders(response, request as NextRequest);
  }
}
