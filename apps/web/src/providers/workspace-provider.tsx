"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { apiFetch } from "@/hooks/api-client";

type Workspace = {
  id: string;
  name: string;
  planSlug: string;
  offerType: string;
  minutesIncluded: number;
  minutesUsed: number;
  minutesOverageLimit: number | null;
  overageRateCents: number | null;
  cycleDurationDays: number;
  createdAt: string;
};

type WorkspaceContextType = {
  workspaceId: string | null;
  workspace: Workspace | null;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  setActiveWorkspace: (id: string) => void;
  loading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceId: null,
  workspace: null,
  activeWorkspace: null,
  workspaces: [],
  setActiveWorkspace: () => {},
  loading: true,
});

export const useWorkspace = () => useContext(WorkspaceContext);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    async function initWorkspace() {
      try {
        // 1. Ensure user profile exists in DB
        await apiFetch("/auth/setup-profile", { method: "POST" }).catch(() => {});

        // 2. Fetch workspaces
        let data = await apiFetch<Workspace[]>("/workspaces");

        // 3. If no workspace, create a default one
        if (data.length === 0) {
          const agencyName = user!.user_metadata?.agency_name || user!.user_metadata?.first_name || user!.email?.split("@")[0] || "Mon";
          const planSlug = user!.user_metadata?.plan_slug || "trial";
          const created = await apiFetch<Workspace>("/workspaces", {
            method: "POST",
            body: JSON.stringify({
              name: `${agencyName} Workspace`,
              offerType: "minutes",
              planSlug,
            }),
          });
          data = [created];
        }

        setWorkspaces(data);
        const savedId = localStorage.getItem("active-workspace");
        const validId = data.find((w) => w.id === savedId)?.id ?? data[0]?.id ?? null;
        setActiveId(validId);
      } catch {
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    }

    initWorkspace();
  }, [user, authLoading]);

  const setActiveWorkspace = (id: string) => {
    setActiveId(id);
    localStorage.setItem("active-workspace", id);
  };

  const workspace = workspaces.find((w) => w.id === activeId) ?? null;

  return (
    <WorkspaceContext.Provider value={{ workspaceId: activeId, workspace, activeWorkspace: workspace, workspaces, setActiveWorkspace, loading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
