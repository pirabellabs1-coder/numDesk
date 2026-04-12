import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function usePhoneNumbers(workspaceId: string | null) {
  return useQuery({
    queryKey: ["phone-numbers", workspaceId],
    queryFn: () => apiFetch<any[]>(`/phone-numbers?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useCreatePhoneNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/phone-numbers", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["phone-numbers"] }),
  });
}

export function useDeletePhoneNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/phone-numbers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["phone-numbers"] }),
  });
}
