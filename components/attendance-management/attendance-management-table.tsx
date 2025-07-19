"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../table";
import { Input } from "../ui/input";
import { Search, Users, Calendar, Clock, TrendingUp, MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useGetForms } from "@/app/(admin)/form-management/_hooks/form_hooks";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AttendanceManagementTable = () => {
  const { data } = useGetForms();
  const router = useRouter();

  const numericFilter: FilterFn<any> = (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return (
      cellValue !== undefined &&
      cellValue !== null &&
      cellValue.toString().includes(value)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const getAttendanceRate = (submissions: number, totalStudents: number = 100) => {
    const rate = (submissions / totalStudents) * 100;
    if (rate >= 80) return { rate, color: 'text-green-600', bg: 'bg-green-100' };
    if (rate >= 60) return { rate, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { rate, color: 'text-red-600', bg: 'bg-red-100' };
  };

  const columns: ColumnDef<NonNullable<typeof data>[number]>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="border-[#4A90E2]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#4A90E2]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "topic",
      header: "Form Topic",
      cell: ({ row }) => {
        const form = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{form.topic}</div>
              <div className="text-sm text-gray-500">Created {new Date(form.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
      filterFn: numericFilter,
    },
    {
      accessorKey: "submissions",
      header: "Attendance",
      cell: ({ row }) => {
        const submissions = row.getValue("submissions") as number || 0;
        const attendance = getAttendanceRate(submissions);
        return (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{submissions}</div>
              <div className={`text-xs ${attendance.color}`}>
                {attendance.rate.toFixed(1)}% rate
              </div>
            </div>
            <div className={`w-2 h-8 rounded-full ${attendance.bg}`}></div>
          </div>
        );
      },
      filterFn: numericFilter,
    },
    {
      accessorKey: "updatedAt",
      header: "Last Activity",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        let timeAgo = '';
        if (diffInHours < 1) timeAgo = 'Just now';
        else if (diffInHours < 24) timeAgo = `${diffInHours}h ago`;
        else timeAgo = `${Math.floor(diffInHours / 24)}d ago`;

        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{timeAgo}</span>
          </div>
        );
      },
      filterFn: numericFilter,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const formId = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/attendance-management/${formId}`)}
              className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/attendance-management/${formId}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Form
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Attendance Forms
              </h2>
              <p className="text-gray-600">
                Manage and track attendance across all your registration forms
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search forms..." 
                  className="pl-10 w-full sm:w-[300px] border-gray-200 focus:border-blue-500" 
                />
              </div>
              
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Form</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-xl font-bold text-gray-900">{data?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Forms</p>
                <p className="text-xl font-bold text-gray-900">
                  {data?.filter(form => form.status === 'active').length || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-xl font-bold text-gray-900">
                  {data?.reduce((sum, form) => sum + (form.submissions || 0), 0) || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                <p className="text-xl font-bold text-gray-900">
                  {data && data.length > 0 
                    ? (data.reduce((sum, form) => sum + (form.submissions || 0), 0) / data.length).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <DataTable 
            columns={columns} 
            data={data || []} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagementTable; 