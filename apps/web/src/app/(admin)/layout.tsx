"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SidebarProvider, useSidebar } from "@/components/dashboard/sidebar-context";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <AdminTopbar />
      <main className={`flex-1 overflow-x-hidden px-8 pb-12 pt-20 transition-all duration-300 ${
        isOpen ? "ml-[220px]" : "ml-0"
      }`}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAuthenticated(false);
      return;
    }

    fetch("/api/admin/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/admin/login");
        } else {
          setAuthenticated(true);
        }
        setChecking(false);
      })
      .catch(() => {
        router.replace("/admin/login");
        setChecking(false);
      });
  }, [pathname, isLoginPage, router]);

  // Login page renders without the admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-on-surface-variant">Vérification...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}
