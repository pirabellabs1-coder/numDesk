import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => apiFetch<any[]>("/templates"),
  });
}
