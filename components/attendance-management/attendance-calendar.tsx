"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  Square,
  Users,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | null;
}

interface Student {
  id: string;
  name: string;
  history: AttendanceRecord[];
}

interface AttendanceCalendarProps {
  students: Student[];
  onDateClick: (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => void;
}

export default function AttendanceCalendar({ students, onDateClick }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusForDate = (studentId: string, date: Date): 'present' | 'absent' | 'late' | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = student.history.find(h => h.date === dateStr);
    return record ? record.status : null;
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Square className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDateClick = (studentId: string, date: Date) => {
    const currentStatus = getStatusForDate(studentId, date);
    let newStatus: 'present' | 'absent' | 'late';
    
    switch (currentStatus) {
      case null:
        newStatus = 'present';
        break;
      case 'present':
        newStatus = 'absent';
        break;
      case 'absent':
        newStatus = 'late';
        break;
      case 'late':
        newStatus = 'present';
        break;
      default:
        newStatus = 'present';
    }
    
    onDateClick(studentId, date, newStatus);
  };

  const filteredStudents = selectedStudent 
    ? students.filter(s => s.id === selectedStudent)
    : students;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Attendance Calendar</h3>
          </div>
          <Badge variant="outline" className="text-sm">
            {students.length} Students
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Student Filter */}
          <select 
            value={selectedStudent || ''} 
            onChange={(e) => setSelectedStudent(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {student.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {daysInMonth.map(day => {
                    const status = getStatusForDate(student.id, day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(student.id, day)}
                        className={`
                          p-2 text-xs rounded-lg transition-colors
                          ${isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-300'}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${status ? getStatusColor(status) : 'bg-white'}
                        `}
                        disabled={!isCurrentMonth}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">{format(day, 'd')}</span>
                          {getStatusIcon(status)}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-600" />
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-600" />
                      <span>Late</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredStudents.map(student => (
            <Card key={student.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {student.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {daysInMonth.map(day => {
                    const status = getStatusForDate(student.id, day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(student.id, day)}
                        className={`
                          p-3 rounded-lg transition-colors text-center
                          ${isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-300'}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${status ? getStatusColor(status) : 'bg-white border border-gray-200'}
                        `}
                        disabled={!isCurrentMonth}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium">{format(day, 'MMM d')}</span>
                          {getStatusIcon(status)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 