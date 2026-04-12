import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useAnomalies(workspaceId: string | null) {
  return useQuery({
    queryKey: ["anomalies", workspaceId],
    queryFn: () => apiFetch<any[]>(`/anomalies?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useResolveAnomaly() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/anomalies/${id}/resolve`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anomalies"] }),
  });
}
