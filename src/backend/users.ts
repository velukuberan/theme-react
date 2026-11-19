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
