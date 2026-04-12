import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useVoices() {
  return useQuery({
    queryKey: ["voices"],
    queryFn: () => apiFetch<any[]>("/voices"),
  });
}

export function useAdminVoices() {
  return useQuery({
    queryKey: ["admin-voices"],
    queryFn: () => apiFetch<any[]>("/admin/voices"),
  });
}
