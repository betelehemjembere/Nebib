import AppSidebar from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopPart from "@/components/ui/top-part";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Fixed sidebar on desktop */}
      <AppSidebar />
      <div className="flex flex-col min-h-screen w-full md:ml-64 bg-gray-50">
        <TopPart />
        <main className="flex-1 w-full transition-all duration-300 ease-in-out overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
