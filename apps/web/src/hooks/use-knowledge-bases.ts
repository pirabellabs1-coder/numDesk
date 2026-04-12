import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useKnowledgeBases(workspaceId: string | null) {
  return useQuery({
    queryKey: ["knowledge-bases", workspaceId],
    queryFn: () => apiFetch<any[]>(`/knowledge-bases?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useKnowledgeBase(id: string | null) {
  return useQuery({
    queryKey: ["knowledge-base", id],
    queryFn: () => apiFetch<any>(`/knowledge-bases/${id}`),
    enabled: !!id,
  });
}

export function useCreateKnowledgeBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/knowledge-bases", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge-bases"] }),
  });
}

export function useUpdateKnowledgeBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      apiFetch<any>(`/knowledge-bases/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["knowledge-bases"] });
      qc.invalidateQueries({ queryKey: ["knowledge-base"] });
    },
  });
}

export function useUploadKBFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kbId, files }: { kbId: string; files: File[] }) => {
      const formData = new FormData();
      formData.append("kbId", kbId);
      files.forEach((f) => formData.append("files", f));
      return fetch("/api/knowledge-bases/upload", { method: "POST", body: formData }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || "Erreur upload");
        return json.data;
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["knowledge-bases"] });
      qc.invalidateQueries({ queryKey: ["knowledge-base"] });
    },
  });
}

export function useDeleteKnowledgeBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/knowledge-bases/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge-bases"] }),
  });
}
