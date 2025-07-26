import TopPart from "@/components/ui/top-part";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <TopPart />
      <main className="flex-1 w-full transition-all duration-300 ease-in-out overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
