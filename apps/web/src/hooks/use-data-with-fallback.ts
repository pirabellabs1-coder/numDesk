import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiFetch } from "./api-client";
import { useWorkspace } from "@/providers/workspace-provider";

/**
 * Hook that fetches from API with automatic fallback to mock data.
 * During the transition period, if the API returns empty or errors,
 * the mock data is used as fallback to keep the UI working.
 */
export function useDataWithFallback<T>(
  key: string,
  apiPath: string,
  mockData: T,
  options?: { enabled?: boolean; workspaceScoped?: boolean }
): UseQueryResult<T> & { isMock: boolean } {
  const { workspaceId } = useWorkspace();
  const workspaceScoped = options?.workspaceScoped ?? true;
  const enabled = options?.enabled ?? true;

  const path = workspaceScoped && workspaceId
    ? `${apiPath}${apiPath.includes("?") ? "&" : "?"}workspace_id=${workspaceId}`
    : apiPath;

  const query = useQuery({
    queryKey: [key, workspaceId],
    queryFn: async () => {
      try {
        const data = await apiFetch<T>(path);
        // If API returns empty array, fallback to mock
        if (Array.isArray(data) && data.length === 0 && Array.isArray(mockData) && (mockData as any[]).length > 0) {
          return mockData;
        }
        return data;
      } catch {
        // API not connected, use mock data
        return mockData;
      }
    },
    enabled: enabled && (workspaceScoped ? !!workspaceId : true),
  });

  const isMock = query.data === mockData;

  return { ...query, isMock } as any;
}
