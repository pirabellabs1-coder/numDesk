import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api-client";

export function useKeywords() {
  return useQuery({
    queryKey: ["keywords"],
    queryFn: () => apiFetch<any[]>("/keywords"),
  });
}
