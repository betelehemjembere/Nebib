"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../table";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useGetForms } from "@/app/(admin)/form-management/_hooks/form_hooks";
import { useRouter } from "next/navigation";
const FormManagementTable = () => {
  const { data } = useGetForms();
  console.log(data);

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
      header: "Topic",
      cell: ({ row }) => {
        const formId = row.original.id;
        const router = useRouter();
        return (
          <div
            onClick={() => router.push(`/form-management/${formId}`)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {row.getValue("topic")}
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => info.getValue(),
      filterFn: numericFilter,
    },
    {
      accessorKey: "submissions",
      header: "Submissions",
      cell: (info) => info.getValue(),
      filterFn: numericFilter,
    },
    {
      accessorKey: "updatedAt",
      header: "Late Submission",
      cell: (info) => {
        const value = info.getValue() as string | number | Date;
        return new Date(value).toDateString();
      },
      filterFn: numericFilter,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);
        return (
          <div className="mr-3 flex gap-5">
            <Button variant="outline" size="sm" onClick={() => {}}>
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Published Forms
          </h2>
          <p className="text-sm text-gray-500">
            A list of all your registration forms and their status
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search forms..." className="pl-8 w-[250px]" />
        </div>
      </div>

      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default FormManagementTable;
