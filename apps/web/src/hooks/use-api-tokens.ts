import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useApiTokens(workspaceId: string | null) {
  return useQuery({
    queryKey: ["api-tokens", workspaceId],
    queryFn: () => apiFetch<any[]>(`/tokens?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useCreateApiToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { workspaceId: string; name: string }) =>
      apiFetch<any>("/tokens", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-tokens"] }),
  });
}

export function useRevokeApiToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/tokens/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-tokens"] }),
  });
}
