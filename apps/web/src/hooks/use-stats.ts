import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useStats(workspaceId: string | null) {
  return useQuery({
    queryKey: ["stats", workspaceId],
    queryFn: () => apiFetch<any>(`/stats?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
