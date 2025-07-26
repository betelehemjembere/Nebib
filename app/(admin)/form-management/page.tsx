import FormManagementTable from "@/components/form-management/form-management-table";
import TopPart from "@/components/form-management/top-part";
import MobileNavigation from "@/components/form-management/mobile-navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { Form } from "@prisma/client";

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await betterFetch<Form[]>(
        `/api/forms`
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20 md:pb-8">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Forms</h1>
                <p className="text-xs text-gray-600">Manage your published forms</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-blue-700">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <TopPart />
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Forms</p>
                    <p className="text-lg font-bold text-gray-900">-</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Active</p>
                    <p className="text-lg font-bold text-gray-900">-</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mb-6">
            <MobileNavigation />
          </div>

          <div className="mt-4 sm:mt-8">
            <FormManagementTable />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
