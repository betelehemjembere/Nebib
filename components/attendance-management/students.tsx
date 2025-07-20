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
      const res = await fetch(`/api/students-info/${data.id}/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
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
      const res = await fetch(`/api/students-info/${data.id}/${studentId}`, {
        method: "DELETE",
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

  // --- Columns ---
  const columns: ColumnDef<TableData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...fieldKeys.map((fieldId) => ({
      accessorKey: fieldId,
      header: fieldLabelMap[fieldId] || fieldId,
      cell: ({ row }) => {
        const value = row.getValue(fieldId);
        return (
          <div className="max-w-[200px] truncate" title={String(value)}>
            {String(value || "")}
          </div>
        );
      },
    })),
    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{row.getValue("createdAt")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditStudent(student);
                setFormState(student);
                setModalOpen(true);
              }}
              className="flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setEditStudent(student);
                  setFormState(student);
                  setModalOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Student
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => {
                  if (confirm("Are you sure you want to delete this student?")) {
                    deleteMutation.mutate(student.studentId);
                  }
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formState };
    delete payload.createdAt;
    delete payload.studentId;

    if (editStudent) {
      editMutation.mutate({ studentId: editStudent.studentId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Student Registrations
            </h2>
            <p className="text-sm text-gray-500">
              {filteredData.length} students registered
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px] border-gray-200 focus:border-blue-500" 
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        <div className="p-6">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {/* Mobile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Students</h2>
              <p className="text-sm text-gray-500">{filteredData.length} registered</p>
            </div>
            <Button 
              onClick={() => setModalOpen(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500" 
            />
          </div>
        </div>

        {/* Student Cards */}
        {filteredData.length > 0 ? (
          <div className="space-y-3">
            {filteredData.map((student, index) => (
              <Card key={student.studentId || index} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {student.name || `Student ${index + 1}`}
                      </h3>
                      <div className="space-y-1">
                        {fieldKeys.slice(0, 3).map((fieldId) => {
                          const value = student[fieldId];
                          if (!value) return null;
                          return (
                            <div key={fieldId} className="text-xs text-gray-600">
                              <span className="font-medium">{fieldLabelMap[fieldId]}:</span> {String(value)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {student.createdAt}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Registered
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditStudent(student);
                        setFormState(student);
                        setModalOpen(true);
                      }}
                      className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditStudent(student);
                          setFormState(student);
                          setModalOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Student
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          if (confirm("Are you sure you want to delete this student?")) {
                            deleteMutation.mutate(student.studentId);
                          }
                        }}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students</h3>
              <p className="text-gray-600 mb-4">No students have registered for this form yet.</p>
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Student
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {data.fields?.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Input
                  type={field.type === "email" ? "email" : "text"}
                  value={formState[field.id] || ""}
                  onChange={(e) =>
                    setFormState({ ...formState, [field.id]: e.target.value })
                  }
                  required={field.required}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  setEditStudent(null);
                  setFormState({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending || editMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {addMutation.isPending || editMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editStudent ? "Updating..." : "Adding..."}
                  </div>
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
