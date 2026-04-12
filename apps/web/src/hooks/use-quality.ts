import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useQuality(workspaceId: string | null) {
  return useQuery({
    queryKey: ["quality", workspaceId],
    queryFn: () => apiFetch<any[]>(`/quality?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
