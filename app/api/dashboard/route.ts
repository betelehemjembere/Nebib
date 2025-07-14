import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function safeNumber(val: any) {
  return typeof val === 'number' && !isNaN(val) && isFinite(val) ? val : 0;
}


export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: Request) => {
  try {
    console.log("[Dashboard API] Starting request...");
    
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[Dashboard API] Session:", session ? "Found" : "Not found");
    
    if (!session?.user?.id) {
      console.log("[Dashboard API] No user ID in session");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return addCorsHeaders(response, request as NextRequest);
    }

    console.log("[Dashboard API] User ID:", session.user.id);

    // Get all forms for the user
    let forms;
    try {
      forms = await db.form.findMany({
        where: { userId: session.user.id },
        include: {
          datas: true,
          fields: true,
        },
        orderBy: { createdAt: "desc" },
      });
      console.log("[Dashboard API] Forms query successful, count:", forms.length);
    } catch (dbError) {
      console.error("[Dashboard API] Database query error:", dbError);
      throw new Error(`Database query failed: ${dbError}`);
    }

    // DEBUG: Log forms and datas count
    console.log("[Dashboard API] User:", session.user.id);
    console.log("[Dashboard API] Forms count:", forms.length);
    forms.forEach(f => console.log(`[Dashboard API] Form: ${f.id}, datas: ${f.datas?.length || 0}`));

    // Calculate current month and last month
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    console.log("[Dashboard API] Calculating statistics...");

    // Calculate statistics
    const totalForms = safeNumber(forms.length);
    const activeForms = safeNumber(forms.filter(form => form.status === 'active' || !form.status).length);
    const totalSubmissions = safeNumber(forms.reduce((sum, form) => sum + (form.datas?.length || 0), 0));
    const avgResponseRate = totalForms > 0 ? Math.round((totalSubmissions / (totalForms * 10)) * 100) : 0;

    console.log("[Dashboard API] Basic stats calculated:", { totalForms, activeForms, totalSubmissions, avgResponseRate });

    // Calculate trends
    const thisMonthForms = safeNumber(forms.filter(form => new Date(form.createdAt) >= thisMonth).length);
    const lastMonthForms = safeNumber(forms.filter(form => {
      const created = new Date(form.createdAt);
      return created >= lastMonth && created < thisMonth;
    }).length);

    const thisMonthSubmissions = safeNumber(forms.reduce((sum, form) => {
      const formSubmissions = form.datas?.filter(submission => 
        new Date(submission.createdAt) >= thisMonth
      ).length || 0;
      return sum + formSubmissions;
    }, 0));

    const lastMonthSubmissions = safeNumber(forms.reduce((sum, form) => {
      const formSubmissions = form.datas?.filter(submission => {
        const created = new Date(submission.createdAt);
        return created >= lastMonth && created < thisMonth;
      }).length || 0;
      return sum + formSubmissions;
    }, 0));

    console.log("[Dashboard API] Trend data calculated:", { 
      thisMonthForms, lastMonthForms, thisMonthSubmissions, lastMonthSubmissions 
    });

    const formTrend = lastMonthForms > 0 ? Math.round(((thisMonthForms - lastMonthForms) / lastMonthForms) * 100) : 0;
    const submissionTrend = lastMonthSubmissions > 0 ? Math.round(((thisMonthSubmissions - lastMonthSubmissions) / lastMonthSubmissions) * 100) : 0;

    // Calculate response rate trends
    const thisMonthResponseRate = thisMonthForms > 0 ? Math.round((thisMonthSubmissions / (thisMonthForms * 10)) * 100) : 0;
    const lastMonthResponseRate = lastMonthForms > 0 ? Math.round((lastMonthSubmissions / (lastMonthForms * 10)) * 100) : 0;
    const responseRateTrend = lastMonthResponseRate > 0 ? Math.round(((thisMonthResponseRate - lastMonthResponseRate) / lastMonthResponseRate) * 100) : 0;

    console.log("[Dashboard API] Trends calculated:", { formTrend, submissionTrend, responseRateTrend });

    // Get recent forms (last 5)
    const recentForms = forms.slice(0, 5).map(form => {
      const lastSubmission = form.datas && form.datas.length > 0 
        ? form.datas.reduce((latest, current) => 
            new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
          )
        : null;

      return {
        id: form.id,
        title: form.topic,
        submissions: safeNumber(form.datas?.length || 0),
        lastSubmission: lastSubmission 
          ? getTimeAgo(new Date(lastSubmission.createdAt))
          : "No submissions",
        status: form.status || "draft",
        category: form.categories ? form.categories.split(',')[0] || "General" : "General",
        createdAt: form.createdAt.toISOString(),
      };
    });

    console.log("[Dashboard API] Recent forms processed:", recentForms.length);

    const responseData = {
      stats: {
        totalForms,
        activeForms,
        totalSubmissions,
        avgResponseRate: safeNumber(avgResponseRate),
        formTrend: safeNumber(formTrend),
        submissionTrend: safeNumber(submissionTrend),
        responseRateTrend: safeNumber(responseRateTrend),
      },
      recentForms,
    };

    console.log("[Dashboard API] Response prepared:", responseData);
    const response = NextResponse.json(responseData);
    return addCorsHeaders(response, request as NextRequest);

  } catch (error) {
    console.error("[Dashboard API] Error details:", error);
    console.error("[Dashboard API] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    const response = NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
    return addCorsHeaders(response, request as NextRequest);
  }
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  }
} 