import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useBillingCycles(workspaceId: string | null) {
  return useQuery({
    queryKey: ["billing-cycles", workspaceId],
    queryFn: () => apiFetch<any[]>(`/billing/cycles?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useBillingUsage(workspaceId: string | null) {
  return useQuery({
    queryKey: ["billing-usage", workspaceId],
    queryFn: () => apiFetch<any>(`/billing/usage?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });
}
