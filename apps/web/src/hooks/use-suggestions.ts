import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useSuggestions(workspaceId: string | null) {
  return useQuery({
    queryKey: ["suggestions", workspaceId],
    queryFn: () => apiFetch<any[]>(`/suggestions?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
