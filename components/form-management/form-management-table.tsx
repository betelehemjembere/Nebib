"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../table";
import { Input } from "../ui/input";
import { Search, Plus, Filter, Download, MoreHorizontal, Eye, Edit, Trash2, Copy, ExternalLink, FileText, Users, Calendar, ArrowRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useGetForms, useDeleteForm } from "@/app/(admin)/form-management/_hooks/form_hooks";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { useState } from "react";

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

const FormManagementTable = () => {
  const { data } = useGetForms();
  const deleteFormMutation = useDeleteForm();
  const router = useRouter();
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);

  const numericFilter: FilterFn<any> = (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return (
      cellValue !== undefined &&
      cellValue !== null &&
      cellValue.toString().includes(value)
    );
  };

  const copyFormLink = (formId: string) => {
    const publicLink = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(publicLink);
    toast.success("Form link copied to clipboard!");
  };

  const openFormLink = (formId: string) => {
    const publicLink = `${window.location.origin}/form/${formId}`;
    window.open(publicLink, "_blank");
  };

  const handleEditForm = (formId: string) => {
    router.push(`/form-generator?edit=1&id=${formId}`);
  };

  const handleDeleteForm = async () => {
    if (!deleteFormId) return;
    
    try {
      await deleteFormMutation.mutateAsync(deleteFormId);
      toast.success("Form deleted successfully!");
      setDeleteFormId(null);
    } catch (error) {
      console.error("Delete form error:", error);
      toast.error("Failed to delete form. Please try again.");
    }
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
          className="border-blue-500 data-[state=checked]:bg-blue-500"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-blue-500 data-[state=checked]:bg-blue-500"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "topic",
      header: "Form Name",
      cell: ({ row }) => {
        const formId = row.original.id;
        const router = useRouter();
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {row.getValue("topic")?.toString().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div
                onClick={() => router.push(`/form-management/${formId}`)}
                className="cursor-pointer font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {row.getValue("topic")}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {row.original.description || "No description"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === "active" ? "default" : "secondary"}
            className={status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {status || "Active"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "submissions",
      header: "Submissions",
      cell: ({ row }) => {
        const submissions = row.original.submissions || 0;
        return (
          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{submissions}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                {submissions === 1 ? 'response' : 'responses'}
              </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">{date.toLocaleDateString()}</div>
            <div className="text-gray-500 dark:text-gray-400">{date.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">{date.toLocaleDateString()}</div>
            <div className="text-gray-500 dark:text-gray-400">{date.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const formId = row.original.id;
        const router = useRouter();
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/form-management/${formId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFormLink(formId)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyFormLink(formId)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditForm(formId)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Form
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteFormId(formId)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Published Forms
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A list of all your registration forms and their status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search forms..." className="pl-10 w-[300px] border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" />
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
              <h2 className="text-lg font-semibold text-gray-800">Forms</h2>
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

        {/* Form Cards */}
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((form: Form) => (
              <Card key={form.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {form.topic?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">{form.topic}</h3>
                        <p className="text-sm text-gray-500 truncate">{form.description || "No description"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={form.status === "active" ? "default" : "secondary"}
                            className={form.status === "active" ? "bg-green-100 text-green-800 text-xs" : "bg-gray-100 text-gray-800 text-xs"}
                          >
                            {form.status || "Active"}
                          </Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{form.submissions || 0} responses</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/form-management/${form.id}`)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{form.submissions || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openFormLink(form.id)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyFormLink(form.id)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-green-600"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditForm(form.id)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit Form"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteFormId(form.id)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Form"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-500 mb-4">Create your first form to start collecting responses</p>
              <Button 
                onClick={() => router.push('/form-generator')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteFormId}
        onClose={() => setDeleteFormId(null)}
        onConfirm={handleDeleteForm}
        title="Delete Form"
        description="Are you sure you want to delete this form? This action cannot be undone and will permanently remove the form and all its data including submissions and attendance records."
        confirmText="Delete Form"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteFormMutation.isPending}
      />
    </div>
  );
};

export default FormManagementTable;
