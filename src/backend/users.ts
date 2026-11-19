import { authRequest } from "./session";

/** Matches UserDetail in the server's OpenAPI spec. */
export type UserDetail = {
  id: string;
  email: string;
  display_name: string;
  job_title: string | null;
  status: string;
  system_role: string;
  created_at: string;
  updated_at: string;
  activated_at: string | null;
  password_reset_required: boolean;
};

export async function getMe(): Promise<UserDetail> {
  const { data } = await authRequest<{ data: UserDetail }>("/api/v1/users/me");
  return data;
}

export type SessionStatus = "active" | "revoked" | "expired";

/** Matches UserSessionDetail. */
export type UserSession = {
  session_id: string;
  created_at: string;
  expires_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  login_ip: string | null;
  last_seen_ip: string | null;
  machine_name: string | null;
  status: SessionStatus;
  is_current: boolean;
};

/** Matches PaginationDetail. */
export type Pagination = { limit: number; offset: number; total: number };

export type SessionsPage = { data: UserSession[]; pagination: Pagination };

/** Current and past sessions of the signed-in user. limit 1–100 (server default 25). */
export async function listMySessions(
  params: { limit?: number; offset?: number; status?: SessionStatus } = {},
): Promise<SessionsPage> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  if (params.status) query.set("status", params.status);
  const suffix = query.size > 0 ? `?${query}` : "";
  return authRequest<SessionsPage>(`/api/v1/users/me/sessions${suffix}`);
}

/** Sign out one session (its history is kept). */
export async function revokeMySession(sessionId: string): Promise<void> {
  await authRequest<void>(`/api/v1/users/me/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
}

/** Sign out every session except this one. Returns how many were signed out. */
export async function revokeMyOtherSessions(): Promise<number> {
  const { data } = await authRequest<{ data: { revoked_count: number } }>("/api/v1/users/me/sessions/revoke-others", {
    method: "POST",
  });
  return data.revoked_count;
}
