import { request } from "./client";

/** Matches LoginTokenData (returned by both /auth/login and /auth/refresh). */
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

/** Rotates the refresh token: the one passed in stops working once this succeeds. */
export async function refresh(refreshToken: string): Promise<LoginTokenData> {
  const { data } = await request<{ data: LoginTokenData }>("/api/v1/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  return data;
}

export async function logout(accessToken: string): Promise<void> {
  await request<void>("/api/v1/auth/logout", { method: "POST", token: accessToken });
}
