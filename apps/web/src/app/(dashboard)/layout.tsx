import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main className="ml-[240px] flex-1 overflow-x-hidden px-8 pb-12 pt-24">
        {children}
      </main>
    </div>
  );
}
