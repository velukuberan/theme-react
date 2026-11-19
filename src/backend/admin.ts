/** Administrator-only calls (users.manage). The server enforces it too: others get 403. */
import { authRequest } from "./session";
import type { Pagination, SessionStatus, SessionsPage, UserDetail } from "./users";

export type UserStatus = "pending" | "active" | "suspended";

/** Matches UserSummary: one row of GET /users. */
export type UserSummary = {
  id: string;
  email: string;
  display_name: string;
  job_title: string | null;
  status: UserStatus;
  system_role: string;
  created_at: string;
};

export type UsersPage = { data: UserSummary[]; pagination: Pagination };

/** All users, newest first (the server's default order). limit 1–100 (server default 25). */
export async function listUsers(params: { limit?: number; offset?: number } = {}): Promise<UsersPage> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  const suffix = query.size > 0 ? `?${query}` : "";
  return authRequest<UsersPage>(`/api/v1/users${suffix}`);
}

/** One user's full details. 404 if there's no such user. */
export async function getUser(userId: string): Promise<UserDetail> {
  const { data } = await authRequest<{ data: UserDetail }>(`/api/v1/users/${encodeURIComponent(userId)}`);
  return data;
}

/** One user's current and past sessions. limit 1–100 (server default 25). */
export async function listUserSessions(
  userId: string,
  params: { limit?: number; offset?: number; status?: SessionStatus } = {},
): Promise<SessionsPage> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  if (params.status) query.set("status", params.status);
  const suffix = query.size > 0 ? `?${query}` : "";
  return authRequest<SessionsPage>(`/api/v1/users/${encodeURIComponent(userId)}/sessions${suffix}`);
}

/** Sign out one of a user's sessions (its history is kept). */
export async function revokeUserSession(userId: string, sessionId: string): Promise<void> {
  await authRequest<void>(`/api/v1/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
}

/** Sign out all of a user's sessions. */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await authRequest<void>(`/api/v1/users/${encodeURIComponent(userId)}/sessions`, { method: "DELETE" });
}
