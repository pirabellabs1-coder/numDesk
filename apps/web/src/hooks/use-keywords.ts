import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useKeywords(workspaceId: string | null) {
  return useQuery({
    queryKey: ["keywords", workspaceId],
    queryFn: () => apiFetch<any[]>(`/keywords?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
