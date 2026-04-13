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
      <main className={`flex-1 overflow-x-hidden px-4 pb-8 pt-16 transition-all duration-300 sm:px-6 sm:pt-18 md:px-8 md:pb-12 md:pt-20 ${
        isOpen ? "ml-0 lg:ml-[220px]" : "ml-0"
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
