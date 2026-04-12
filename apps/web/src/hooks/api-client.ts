export class ApiClientError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiClientError(
      json.error?.code ?? "UNKNOWN",
      json.error?.message ?? "Erreur inconnue",
      res.status
    );
  }

  return json.data;
}
