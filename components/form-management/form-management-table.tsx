"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../table";
import { Input } from "../ui/input";
import { Search, Plus, Filter, Download, MoreHorizontal, Eye, Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useGetForms } from "@/app/(admin)/form-management/_hooks/form_hooks";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
const FormManagementTable = () => {
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
                className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {row.getValue("topic")}
              </div>
              <div className="text-sm text-gray-500">
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
            <div className="text-lg font-semibold text-gray-900">{submissions}</div>
            <div className="text-xs text-gray-500">
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
            <div className="font-medium text-gray-900">{date.toLocaleDateString()}</div>
            <div className="text-gray-500">{date.toLocaleTimeString()}</div>
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
            <div className="font-medium text-gray-900">{date.toLocaleDateString()}</div>
            <div className="text-gray-500">{date.toLocaleTimeString()}</div>
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
        
        const copyFormLink = () => {
          const publicLink = `${window.location.origin}/form/${formId}`;
          navigator.clipboard.writeText(publicLink);
          toast.success("Form link copied to clipboard!");
        };

        const openFormLink = () => {
          const publicLink = `${window.location.origin}/form/${formId}`;
          window.open(publicLink, "_blank");
        };

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
              <DropdownMenuItem onClick={openFormLink}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyFormLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Form
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Published Forms
          </h2>
          <p className="text-sm text-gray-500">
            A list of all your registration forms and their status
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
  );
};

export default FormManagementTable;
