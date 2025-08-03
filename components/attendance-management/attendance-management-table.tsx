"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../table";
import { Input } from "../ui/input";
import { Search, Users, Calendar, Clock, TrendingUp, MoreHorizontal, Eye, Edit, Trash2, Plus, Filter } from "lucide-react";
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

interface Form {
  id: string;
  topic: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissions: number;
  type: 'Public' | 'Private';
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  datas?: Array<{
    id: string;
    data: any;
    createdAt: string;
  }>;
}

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

  const columns: ColumnDef<Form>[] = [
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
      {/* Desktop Table */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Attendance Forms
            </h2>
            <p className="text-sm text-gray-500">
              Manage and track attendance across all your registration forms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search forms..." className="pl-10 w-[300px] border-gray-200 focus:border-blue-500" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              onClick={() => router.push('/form-generator')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>

        <div className="p-6">
          <DataTable columns={columns} data={data || []} />
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {/* Mobile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Attendance Forms</h2>
              <p className="text-sm text-gray-500">{data?.length || 0} total forms</p>
            </div>
            <Button 
              onClick={() => router.push('/form-generator')}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search forms..." className="pl-10 border-gray-200 focus:border-blue-500" />
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Forms</p>
                <p className="text-lg font-bold text-gray-900">{data?.length || 0}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Active Forms</p>
                <p className="text-lg font-bold text-gray-900">
                  {data?.filter((form: Form) => form.status === 'active').length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Cards */}
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((form: Form) => {
              const attendance = getAttendanceRate(form.submissions || 0);
              const date = new Date(form.updatedAt);
              const now = new Date();
              const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
              
              let timeAgo = '';
              if (diffInHours < 1) timeAgo = 'Just now';
              else if (diffInHours < 24) timeAgo = `${diffInHours}h ago`;
              else timeAgo = `${Math.floor(diffInHours / 24)}d ago`;

              return (
                <Card key={form.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{form.topic}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(form.status || 'unknown')}
                          <span className="text-xs text-gray-500">Created {new Date(form.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{form.submissions || 0}</div>
                        <div className={`text-xs ${attendance.color}`}>
                          {attendance.rate.toFixed(1)}% rate
                        </div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {timeAgo}
                        </div>
                        <div className="text-xs text-gray-500">Last activity</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/attendance-management/${form.id}`)}
                        className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/attendance-management/${form.id}`)}>
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Forms</h3>
              <p className="text-gray-600 mb-4">Create your first attendance form to start tracking student attendance.</p>
              <Button 
                onClick={() => router.push('/form-generator')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Form
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagementTable; 