"use client";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { WorkspaceProvider } from "./workspace-provider";
import { ToastProvider } from "./toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
