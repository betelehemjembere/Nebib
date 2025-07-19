import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { Form } from "@prisma/client";
import AttendanceManagementTable from "@/components/attendance-management/attendance-management-table";
import TopPart from "@/components/attendance-management/top-part";

export default async function AttendanceManagementPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await betterFetch<Form[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/get`
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TopPart />
          <AttendanceManagementTable />
        </div>
      </div>
    </HydrationBoundary>
  );
} 