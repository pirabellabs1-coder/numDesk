"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { FocusProvider, FocusBanner } from "@/components/dashboard/focus-mode";
import { SidebarProvider, useSidebar } from "@/components/dashboard/sidebar-context";
import { CreditWarning } from "@/components/billing/credit-warning";
import { PlanRestriction } from "@/components/billing/plan-restriction";
import { PushNotificationInit } from "@/components/dashboard/push-notifications";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <FocusBanner />
      <CreditWarning />
      <main className={`flex-1 overflow-x-hidden px-8 pb-12 pt-20 transition-all duration-300 ${
        isOpen ? "ml-[220px]" : "ml-0"
      }`}>
        <PlanRestriction>{children}</PlanRestriction>
      </main>
      <OnboardingWizard />
      <QuickActions />
      <PushNotificationInit />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <FocusProvider>
        <DashboardContent>{children}</DashboardContent>
      </FocusProvider>
    </SidebarProvider>
  );
}
