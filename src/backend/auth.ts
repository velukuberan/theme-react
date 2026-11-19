import { request } from "./client";

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

/** Matches LoginTokenData. */
export type LoginTokenData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_at: string;
  session_id: string;
};

export async function login(email: string, password: string): Promise<LoginTokenData> {
  const { data } = await request<{ data: LoginTokenData }>("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return data;
}

export async function getMe(token: string): Promise<UserDetail> {
  const { data } = await request<{ data: UserDetail }>("/api/v1/users/me", { token });
  return data;
}

export async function logout(token: string): Promise<void> {
  await request<void>("/api/v1/auth/logout", { method: "POST", token });
}
