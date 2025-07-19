"use client";

import { useEffect, useState } from "react";
import { Data, Field, Form } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { JsonObject } from "type-fest";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Square,
  CalendarDays,
  Grid3X3,
  List
} from "lucide-react";
import { toast } from "sonner";
import AttendanceCalendar from "./attendance-calendar";
import { format } from "date-fns";

export interface StudentsDatasProps {
  data: Form & {
    datas: Data[] | null | undefined;
    fields: Field[];
  };
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | null;
}

export default function CheckIn({ data }: StudentsDatasProps) {
  const { datas = [], fields } = data;
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'unmarked'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, AttendanceRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real attendance records for this form
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/attendance?formId=${data.id}`, {
        credentials: 'include'
      });
        if (!res.ok) throw new Error("Failed to fetch attendance records");
        const result = await res.json();
        // Filter records for this form only
        const records = (result.attendanceRecords || []).filter((r: any) => r.formId === data.id);
        // Build status and history maps
        const statusMap: Record<string, 'present' | 'absent' | 'late' | null> = {};
        const historyMap: Record<string, AttendanceRecord[]> = {};
        records.forEach((rec: any) => {
          if (!historyMap[rec.studentId]) historyMap[rec.studentId] = [];
          historyMap[rec.studentId].push({ date: rec.date, status: rec.status });
          // Set today's status
          if (rec.date === format(new Date(), 'yyyy-MM-dd')) {
            statusMap[rec.studentId] = rec.status;
          }
        });
        setAttendanceStatus(statusMap);
        setAttendanceHistory(historyMap);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [data.id]);

  const filteredDatas = datas?.filter((entry) => {
    if (!entry.data || typeof entry.data !== "object") return false;

    const matchesSearch = Object.values(entry.data as JsonObject).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!matchesSearch) return false;

    // Apply status filter
    const status = attendanceStatus[entry.id];
    switch (filterStatus) {
      case 'present':
        return status === 'present';
      case 'absent':
        return status === 'absent';
      case 'late':
        return status === 'late';
      case 'unmarked':
        return status === null || status === undefined;
      default:
        return true;
    }
  });

  // Update handleCheckIn to POST to backend
  const handleCheckIn = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedHistory = [
      ...(attendanceHistory[studentId] || []).filter(record => record.date !== today),
      { date: today, status }
    ];
    setAttendanceHistory(prev => ({ ...prev, [studentId]: updatedHistory }));
    try {
      const res = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ formId: data.id, studentId, date: today, status }),
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      toast.success(`Marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  // Update handleCalendarDateClick to POST to backend
  const handleCalendarDateClick = async (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => {
    const student = filteredDatas?.find(entry => entry.id === studentId);
    if (!student) return;
    
    const registrationDate = new Date(student.createdAt);
    const checkDate = new Date(date);
    
    // Compare dates at day level (ignoring time)
    const registrationDay = new Date(registrationDate.getFullYear(), registrationDate.getMonth(), registrationDate.getDate());
    const checkDay = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    
    // Don't allow marking attendance before registration date
    if (checkDay < registrationDay) {
      toast.error(`Cannot mark attendance before registration date (${format(registrationDate, 'MMM dd, yyyy')})`);
      return;
    }
    
    // Don't allow marking attendance for future dates
    if (checkDay > today) {
      toast.error("Cannot mark attendance for future dates");
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const updatedHistory = [
      ...(attendanceHistory[studentId] || []).filter(record => record.date !== dateStr),
      { date: dateStr, status }
    ];
    setAttendanceHistory(prev => ({ ...prev, [studentId]: updatedHistory }));
    if (dateStr === format(new Date(), 'yyyy-MM-dd')) {
      setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    }
    try {
      const res = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ formId: data.id, studentId, date: dateStr, status }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      toast.success(`Updated attendance for ${format(date, 'MMM dd, yyyy')}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update attendance");
    }
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge variant="outline">Unmarked</Badge>;
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Square className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStudentName = (entry: Data): string => {
    const nameField = fields.find(f => f.label.toLowerCase().includes('name'));
    const nameValue = nameField ? (entry.data as JsonObject)?.[nameField.id] : null;
    return typeof nameValue === 'string' ? nameValue : 'Unknown Student';
  };

  const getStudentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const presentCount = Object.values(attendanceStatus).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceStatus).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendanceStatus).filter(s => s === 'late').length;
  const unmarkedCount = (datas?.length || 0) - presentCount - absentCount - lateCount;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Check-In</h2>
                    <p className="text-gray-600">Mark attendance for {data.topic}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px] border-gray-200 focus:border-green-500" 
                  />
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={viewMode === 'cards' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    <CalendarDays className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button 
                  className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => {
                    toast.success("Attendance saved successfully!");
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Attendance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unmarked</p>
                  <p className="text-2xl font-bold text-gray-900">{unmarkedCount}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterStatus === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All ({(datas?.length || 0)})
          </Button>
          <Button 
            variant={filterStatus === 'present' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('present')}
            className={filterStatus === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Present ({presentCount})
          </Button>
          <Button 
            variant={filterStatus === 'absent' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('absent')}
            className={filterStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Absent ({absentCount})
          </Button>
          <Button 
            variant={filterStatus === 'late' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('late')}
            className={filterStatus === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
          >
            Late ({lateCount})
          </Button>
          <Button 
            variant={filterStatus === 'unmarked' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('unmarked')}
          >
            Unmarked ({unmarkedCount})
          </Button>
        </div>

        {/* Students List */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDatas?.map((entry) => {
              const studentName = getStudentName(entry);
              const initials = getStudentInitials(studentName);
              const status = attendanceStatus[entry.id];
              const registrationDate = new Date(entry.createdAt);
              const history = attendanceHistory[entry.id] || [];
              
              return (
                <Card key={entry.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{studentName}</h3>
                          <p className="text-sm text-gray-500">ID: {entry.id.slice(-6)}</p>
                        </div>
                      </div>
                      {getStatusIcon(status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      {fields.slice(0, 3).map((field) => (
                        <div key={field.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{field.label}:</span>
                          <span className="font-medium text-gray-900">
                            {String((entry.data as JsonObject)?.[field.id] ?? "N/A")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={status === 'present' ? 'default' : 'outline'}
                          onClick={() => handleCheckIn(entry.id, 'present')}
                          className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'absent' ? 'default' : 'outline'}
                          onClick={() => handleCheckIn(entry.id, 'absent')}
                          className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'late' ? 'default' : 'outline'}
                          onClick={() => handleCheckIn(entry.id, 'late')}
                          className={status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                        >
                          Late
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <AttendanceCalendar 
                students={(filteredDatas || []).map(entry => ({
                  id: entry.id,
                  name: getStudentName(entry),
                  history: attendanceHistory[entry.id] || [],
                  registrationDate: new Date(entry.createdAt)
                }))}
                onDateClick={handleCalendarDateClick}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
