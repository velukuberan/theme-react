/** Administrator-only calls (users.manage). The server enforces it too: others get 403. */
import { authRequest } from "./session";
import type { Pagination } from "./users";

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
