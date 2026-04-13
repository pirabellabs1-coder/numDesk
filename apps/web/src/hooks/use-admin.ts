import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<any>("/admin/stats"),
  });
}

export function useAdminMembers() {
  return useQuery({
    queryKey: ["admin-members"],
    queryFn: () => apiFetch<any[]>("/admin/members"),
  });
}

export function useAdminWorkspaces() {
  return useQuery({
    queryKey: ["admin-workspaces"],
    queryFn: () => apiFetch<any[]>("/admin/workspaces"),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => apiFetch<any>(`/admin/members/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-members"] }),
  });
}

export function useAdminContacts() {
  return useQuery({ queryKey: ["admin-contacts"], queryFn: () => apiFetch<any[]>("/admin/contacts") });
}

export function useAdminTeams() {
  return useQuery({ queryKey: ["admin-teams"], queryFn: () => apiFetch<any[]>("/admin/teams") });
}

export function useAdminAnomalies() {
  return useQuery({ queryKey: ["admin-anomalies"], queryFn: () => apiFetch<any[]>("/admin/anomalies") });
}

export function useAdminLeads() {
  return useQuery({ queryKey: ["admin-leads"], queryFn: () => apiFetch<any[]>("/admin/leads") });
}

export function useAdminTags() {
  return useQuery({ queryKey: ["admin-tags"], queryFn: () => apiFetch<any[]>("/admin/tags") });
}

export function useAdminQuality() {
  return useQuery({ queryKey: ["admin-quality"], queryFn: () => apiFetch<any[]>("/admin/quality") });
}

export function useAdminKeywords() {
  return useQuery({ queryKey: ["admin-keywords"], queryFn: () => apiFetch<any[]>("/admin/keywords") });
}

export function useAdminOffers() {
  return useQuery({ queryKey: ["admin-offers"], queryFn: () => apiFetch<any[]>("/admin/offers") });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/admin/offers", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-offers"] }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/admin/offers", { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-offers"] }),
  });
}

export function useAdminAlerts() {
  return useQuery({ queryKey: ["admin-alerts"], queryFn: () => apiFetch<any[]>("/admin/alerts") });
}

export function useAckAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>("/admin/alerts", { method: "PATCH", body: JSON.stringify({ id, isAcknowledged: true }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-alerts"] }),
  });
}

export function useAdminRevenue() {
  return useQuery({ queryKey: ["admin-revenue"], queryFn: () => apiFetch<any>("/admin/revenue") });
}

export function useAdminHealth() {
  return useQuery({
    queryKey: ["admin-health"],
    queryFn: () => apiFetch<any>("/admin/health"),
    refetchInterval: 60000, // refresh every 60s
  });
}

export function useAdminLogs() {
  return useQuery({ queryKey: ["admin-logs"], queryFn: () => apiFetch<any[]>("/admin/logs"), refetchInterval: 10000 });
}

export function useAdminSipTrunks() {
  return useQuery({ queryKey: ["admin-sip-trunks"], queryFn: () => apiFetch<any[]>("/sip-trunks") });
}

export function useCreateSipTrunk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => apiFetch<any>("/sip-trunks", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sip-trunks"] }),
  });
}

export function useDeleteSipTrunk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/sip-trunks/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sip-trunks"] }),
  });
}
