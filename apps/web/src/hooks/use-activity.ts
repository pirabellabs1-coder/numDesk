import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useActivity(workspaceId: string | null, limit = 50) {
  return useQuery({
    queryKey: ["activity", workspaceId, limit],
    queryFn: () => apiFetch<any[]>(`/activity?workspace_id=${workspaceId}&limit=${limit}`),
    enabled: !!workspaceId,
  });
}
