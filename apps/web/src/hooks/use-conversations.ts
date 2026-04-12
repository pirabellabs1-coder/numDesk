import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useConversations(workspaceId: string | null, filters?: { status?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (workspaceId) params.set("workspace_id", workspaceId);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.limit) params.set("limit", String(filters.limit));

  return useQuery({
    queryKey: ["conversations", workspaceId, filters],
    queryFn: () => apiFetch<any[]>(`/conversations?${params}`),
    enabled: !!workspaceId,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => apiFetch<any>(`/conversations/${id}`),
    enabled: !!id,
  });
}
