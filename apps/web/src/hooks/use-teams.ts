import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useTeams(workspaceId: string | null) {
  return useQuery({
    queryKey: ["teams", workspaceId],
    queryFn: () => apiFetch<any[]>(`/teams?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/teams", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/teams/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}
