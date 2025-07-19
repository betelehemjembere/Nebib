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
  List,
  Table
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, isAfter, startOfDay } from "date-fns";

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | null;
}

interface Student {
  id: string;
  name: string;
  history: AttendanceRecord[];
  registrationDate: Date;
}

interface AttendanceCalendarProps {
  students: Student[];
  onDateClick: (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => void;
}

export default function AttendanceCalendar({ students, onDateClick }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'table'>('calendar');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = startOfDay(new Date());

  const getStatusForDate = (studentId: string, date: Date): 'present' | 'absent' | 'late' | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = student.history.find(h => h.date === dateStr);
    return record ? record.status : null;
  };

  const isDateSelectable = (student: Student, date: Date): boolean => {
    const registrationDate = startOfDay(student.registrationDate);
    const checkDate = startOfDay(date);
    const today = startOfDay(new Date());
    
    // Date should be from registration date to today (inclusive)
    return !isBefore(checkDate, registrationDate) && !isAfter(checkDate, today);
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

  const getStatusText = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'Late';
      default:
        return 'Unmarked';
    }
  };

  const handleDateClick = (studentId: string, date: Date) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !isDateSelectable(student, date)) {
      return; // Don't allow clicking on non-selectable dates
    }

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
            <Button 
              variant={viewMode === 'table' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Table className="w-4 h-4" />
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

      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="truncate">{student.name}</span>
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Registered: {format(student.registrationDate, 'MMM dd, yyyy')}
                </p>
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
                    const isSelectable = isDateSelectable(student, day);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(student.id, day)}
                        className={`
                          p-1 sm:p-2 text-xs rounded-lg transition-colors min-h-[40px] sm:min-h-[48px]
                          ${isCurrentMonth && isSelectable ? 'hover:bg-gray-100' : ''}
                          ${!isCurrentMonth ? 'text-gray-300' : ''}
                          ${!isSelectable ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : ''}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${status && isSelectable ? getStatusColor(status) : 'bg-white'}
                        `}
                        disabled={!isCurrentMonth || !isSelectable}
                        title={!isSelectable ? `Not available before ${format(student.registrationDate, 'MMM dd, yyyy')}` : ''}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-xs sm:text-sm">{format(day, 'd')}</span>
                          {isSelectable && getStatusIcon(status)}
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
                    <div className="flex items-center gap-1">
                      <Square className="w-3 h-3 text-gray-400" />
                      <span>Unmarked</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                      <span>Before Registration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredStudents.map(student => (
            <Card key={student.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {student.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Registered: {format(student.registrationDate, 'MMM dd, yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {daysInMonth.map(day => {
                    const status = getStatusForDate(student.id, day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelectable = isDateSelectable(student, day);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(student.id, day)}
                        className={`
                          p-3 rounded-lg transition-colors text-center
                          ${isCurrentMonth && isSelectable ? 'hover:bg-gray-100' : ''}
                          ${!isCurrentMonth ? 'text-gray-300' : ''}
                          ${!isSelectable ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : ''}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${status && isSelectable ? getStatusColor(status) : 'bg-white border border-gray-200'}
                        `}
                        disabled={!isCurrentMonth || !isSelectable}
                        title={!isSelectable ? `Not available before ${format(student.registrationDate, 'MMM dd, yyyy')}` : ''}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium">{format(day, 'MMM d')}</span>
                          {isSelectable && getStatusIcon(status)}
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

      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Registration Date
                      </th>
                      {daysInMonth.map(day => (
                        <th key={day.toISOString()} className="px-2 py-3 text-center text-xs font-medium text-gray-900 border-b border-gray-200 min-w-[60px]">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">{format(day, 'EEE')}</span>
                            <span className="font-medium">{format(day, 'd')}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="truncate max-w-[150px]">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                          {format(student.registrationDate, 'MMM dd, yyyy')}
                        </td>
                        {daysInMonth.map(day => {
                          const status = getStatusForDate(student.id, day);
                          const isToday = isSameDay(day, new Date());
                          const isCurrentMonth = isSameMonth(day, currentMonth);
                          const isSelectable = isDateSelectable(student, day);
                          
                          return (
                            <td key={day.toISOString()} className="px-2 py-3 text-center border-b border-gray-200">
                              <button
                                onClick={() => handleDateClick(student.id, day)}
                                className={`
                                  w-full h-8 rounded-md transition-colors flex items-center justify-center
                                  ${isCurrentMonth && isSelectable ? 'hover:bg-gray-100' : ''}
                                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                                  ${!isSelectable ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : ''}
                                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                                  ${status && isSelectable ? getStatusColor(status) : 'bg-white border border-gray-200'}
                                `}
                                disabled={!isCurrentMonth || !isSelectable}
                                title={!isSelectable ? `Not available before ${format(student.registrationDate, 'MMM dd, yyyy')}` : `${format(day, 'MMM dd, yyyy')}: ${getStatusText(status)}`}
                              >
                                {isSelectable && getStatusIcon(status)}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Legend */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-xs">
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
                  <div className="flex items-center gap-1">
                    <Square className="w-3 h-3 text-gray-400" />
                    <span>Unmarked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                    <span>Before Registration</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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