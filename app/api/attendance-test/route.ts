import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("Attendance Test API: Starting request");
    
    // Get all forms for testing (using the first user)
    const users = await db.user.findMany({ take: 1 });
    if (users.length === 0) {
      const response = NextResponse.json({ error: "No users found" }, { status: 404 });
      return addCorsHeaders(response, request);
    }
    
    const userId = users[0].id;
    console.log("Attendance Test API: Using user", userId);
    
    const attendanceForms = await db.form.findMany({
      where: { 
        userId: userId
      },
      include: {
        datas: true,
        fields: true,
      },
    });

    console.log("Attendance Test API: Found forms", { count: attendanceForms.length });

    // Process attendance data from all forms
    const attendanceRecords: any[] = [];
    const sessionStats: any[] = [];

    attendanceForms.forEach(form => {
      console.log("Attendance Test API: Processing form", { formId: form.id, dataCount: form.datas?.length });
      
      // Group submissions by date to create sessions
      const submissionsByDate = new Map<string, any[]>();
      
      form.datas?.forEach(submission => {
        try {
          const date = new Date(submission.createdAt).toISOString().split('T')[0];
          if (!submissionsByDate.has(date)) {
            submissionsByDate.set(date, []);
          }
          submissionsByDate.get(date)!.push(submission);
        } catch (error) {
          console.error("Attendance Test API: Error processing submission", { submissionId: submission.id, error });
        }
      });

      // Convert to attendance records
      submissionsByDate.forEach((submissions, date) => {
        const sessionName = `Session ${new Date(date).toLocaleDateString()}`;
        
        submissions.forEach(submission => {
          try {
            const data = submission.data as any;
            const studentName = data.name || data.fullName || data.studentName || 'Unknown';
            const status = data.status || data.attendanceStatus || 'present';
            
            attendanceRecords.push({
              id: `${submission.id}`,
              studentId: submission.id,
              studentName,
              date,
              status,
              session: sessionName,
              formId: form.id,
              formTitle: form.topic
            });
          } catch (error) {
            console.error("Attendance Test API: Error processing attendance record", { submissionId: submission.id, error });
          }
        });

        // Calculate session stats
        const total = submissions.length;
        const present = submissions.filter(s => {
          try {
            return (s.data as any).status === 'present';
          } catch (error) {
            console.error("Attendance Test API: Error checking status", { submissionId: s.id, error });
            return false;
          }
        }).length;
        const absent = submissions.filter(s => {
          try {
            return (s.data as any).status === 'absent';
          } catch (error) {
            console.error("Attendance Test API: Error checking status", { submissionId: s.id, error });
            return false;
          }
        }).length;
        const late = submissions.filter(s => {
          try {
            return (s.data as any).status === 'late';
          } catch (error) {
            console.error("Attendance Test API: Error checking status", { submissionId: s.id, error });
            return false;
          }
        }).length;

        sessionStats.push({
          session: sessionName,
          total,
          present,
          absent,
          late,
          attendanceRate: total > 0 ? (present / total) * 100 : 0,
          date
        });
      });
    });

    console.log("Attendance Test API: Processed records", { 
      attendanceRecordsCount: attendanceRecords.length,
      sessionStatsCount: sessionStats.length 
    });

    // Calculate overall statistics
    const totalStudents = new Set(attendanceRecords.map(r => r.studentId)).size;
    const totalPresent = attendanceRecords.filter(r => r.status === 'present').length;
    const totalAbsent = attendanceRecords.filter(r => r.status === 'absent').length;
    const totalLate = attendanceRecords.filter(r => r.status === 'late').length;
    const totalRecords = attendanceRecords.length;
    const averageAttendance = totalRecords > 0 ? ((totalPresent / totalRecords) * 100) : 0;

    const responseData = {
      attendanceRecords,
      sessionStats: sessionStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      statistics: {
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
        totalRecords,
        averageAttendance,
        totalSessions: sessionStats.length
      }
    };

    console.log("Attendance Test API: Returning response", { 
      statistics: responseData.statistics,
      recordsCount: responseData.attendanceRecords.length 
    });

    const response = NextResponse.json(responseData);
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Attendance Test API error:", error);
    console.error("Attendance Test API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    const response = NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 