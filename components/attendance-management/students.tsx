"use client";

import { Data, Field, Form } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../table";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export interface StudentsDatasProps {
  data: Form & {
    datas: Data[] | null | undefined;
    fields: Field[];
  };
}

interface TableData {
  [key: string]: any;
}

const Students = ({ data }: StudentsDatasProps) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any | null>(null);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const fieldLabelMap =
    data.fields?.reduce((acc: Record<string, string>, field: Field) => {
      acc[field.id] = field.label;
      return acc;
    }, {}) || {};

  const tableData: TableData[] =
    data.datas?.map((entry) => ({
      ...(entry.data as Record<string, any>),
      createdAt: new Date(entry.createdAt).toLocaleString(),
      studentId: entry.id,
    })) || [];

  const filteredData = tableData.filter((student) => {
    if (!searchTerm) return true;
    return Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fieldKeys = data.fields?.map((f) => f.id) || [];

  // --- Mutations ---
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`/api/students-info/${data.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("Failed to add student");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Student added successfully");
      setModalOpen(false);
      setFormState({});
      queryClient.invalidateQueries({ queryKey: ["students", data.id] });
    },
    onError: () => toast.error("Failed to add student"),
  });

  const editMutation = useMutation({
    mutationFn: async ({ studentId, payload }: any) => {
      const res = await fetch(`/api/students-info/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, data: payload }),
      });
      if (!res.ok) throw new Error("Failed to update student");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Student updated successfully");
      setModalOpen(false);
      setEditStudent(null);
      setFormState({});
      queryClient.invalidateQueries({ queryKey: ["students", data.id] });
    },
    onError: () => toast.error("Failed to update student"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await fetch(`/api/students-info/${data.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      if (!res.ok) throw new Error("Failed to delete student");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["students", data.id] });
    },
    onError: () => toast.error("Failed to delete student"),
  });

  // --- Table Columns ---
  const dynamicColumns: ColumnDef<TableData>[] = data.fields.map((field) => ({
    accessorKey: field.id,
    header: field.label,
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "boolean" ? (
        <Checkbox checked={value} disabled />
      ) : (
        <span className="text-sm text-gray-700">{String(value)}</span>
      );
    },
  }));

  const columns: ColumnDef<TableData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-[#4A90E2]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#4A90E2]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original;
        const name = student[data.fields.find(f => f.label.toLowerCase().includes('name'))?.id || ''] || 'Unknown';
        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{name}</div>
              <div className="text-sm text-gray-500">ID: {student.studentId.slice(-6)}</div>
            </div>
          </div>
        );
      },
    },
    ...dynamicColumns,
    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{date.toLocaleDateString()}</span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        // Mock status based on registration date
        const date = new Date(row.getValue("createdAt"));
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays <= 7) {
          return <Badge className="bg-green-100 text-green-800">Active</Badge>;
        } else if (diffInDays <= 30) {
          return <Badge className="bg-yellow-100 text-yellow-800">Recent</Badge>;
        } else {
          return <Badge variant="secondary">Registered</Badge>;
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditStudent(row.original);
                setFormState(row.original);
                setModalOpen(true);
              }}
              className="h-8 px-3"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setEditStudent(row.original);
                  setFormState(row.original);
                  setModalOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this student?")) {
                      deleteMutation.mutate(row.original.studentId);
                    }
                  }}
                >
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

  // --- Modal Form ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStudent) {
      editMutation.mutate({ studentId: editStudent.studentId, payload: formState });
    } else {
      addMutation.mutate(formState);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{data.topic}</h2>
                  <p className="text-gray-600">Manage student registrations and attendance</p>
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
                  className="pl-10 w-[300px] border-gray-200 focus:border-blue-500" 
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => {
                  setEditStudent(null);
                  setFormState({});
                  setModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{tableData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tableData.filter(s => {
                    const date = new Date(s.createdAt);
                    const now = new Date();
                    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffInDays <= 7;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Registrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tableData.filter(s => {
                    const date = new Date(s.createdAt);
                    const now = new Date();
                    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffInDays <= 30;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tableData.filter(s => {
                    const date = new Date(s.createdAt);
                    const now = new Date();
                    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffInDays > 30;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Table */}
      <Card className="border-0 shadow-lg">
        <DataTable columns={columns} data={filteredData} />
      </Card>

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={formState[field.id] ?? ""}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, [field.id]: e.target.value }))
                    }
                    required={field.required}
                    className="w-full"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addMutation.isPending || editMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {addMutation.isPending || editMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {editStudent ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editStudent ? "Update Student" : "Add Student"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
