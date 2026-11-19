/**
 * Fetch wrapper for the Restling Server (channel 1: the app's own backend).
 * Not for the APIs the user is testing: those go through the Rust engine.
 */

/** Empty = same origin. In development the webpack dev server proxies /api to the server. */
export const BACKEND_URL = "";

/** The server's error envelope: { "error": { "code": "...", "message": "..." } } */
export class BackendError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

const unreachable = () => new BackendError(0, "NETWORK_ERROR", "Can't reach the server. Check that it's running.");

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export async function request<T>(path: string, { method = "GET", body, token }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw unreachable();
  }

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string } } | null)?.error;
    // A gateway error without the server's envelope means the server itself didn't answer
    // (e.g. the dev proxy couldn't connect).
    if (!error && [502, 503, 504].includes(response.status)) throw unreachable();
    throw new BackendError(
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? `Request failed (${response.status}).`,
    );
  }

  return payload as T;
}
