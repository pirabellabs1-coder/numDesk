import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useWorkspaceMembers(workspaceId: string | null) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => apiFetch<{ members: any[]; invitations: any[] }>(`/workspaces/members?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useSendInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { workspaceId: string; email: string; role?: string }) =>
      apiFetch<any>("/workspaces/members", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspace-members"] }),
  });
}

export function useCancelInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      apiFetch<any>(`/invitations?id=${invitationId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspace-members"] }),
  });
}
