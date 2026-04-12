import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useRecordings(workspaceId: string | null) {
  return useQuery({
    queryKey: ["recordings", workspaceId],
    queryFn: () => apiFetch<any[]>(`/recordings?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
