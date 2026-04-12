import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useKnowledgeBases(workspaceId: string | null) {
  return useQuery({
    queryKey: ["knowledge-bases", workspaceId],
    queryFn: () => apiFetch<any[]>(`/knowledge-bases?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useCreateKnowledgeBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/knowledge-bases", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge-bases"] }),
  });
}

export function useDeleteKnowledgeBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/knowledge-bases/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge-bases"] }),
  });
}
