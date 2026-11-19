import { useCallback } from "react";
import { type User, useAuth } from "./AuthContext";

/** Things a user may do. Names are `area.action`, the same ones the server enforces. */
export type Permission = "users.manage";

/**
 * The ONLY place that knows which role may do what.
 * Once GET /users/me returns `permissions`, read that here instead and delete this map
 * (see the "Backend TODO: permissions in /users/me" doc).
 */
const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  administrator: ["users.manage"],
  user: [],
};

export const hasPermission = (user: User | null, permission: Permission): boolean =>
  !!user && (ROLE_PERMISSIONS[user.system_role] ?? []).includes(permission);

/** `const can = useCan(); can("users.manage")` — for menus, routes and buttons. */
export function useCan(): (permission: Permission) => boolean {
  const { user } = useAuth();
  return useCallback((permission: Permission) => hasPermission(user, permission), [user]);
}
