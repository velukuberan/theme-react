import type { UserStatus } from "../../backend/admin";

const STATUS_STYLE: Record<UserStatus, string> = {
  active: "bg-ok/12 text-ok",
  pending: "bg-warn/12 text-warn",
  suspended: "bg-err/12 text-err",
};

export function UserStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[status as UserStatus] ?? "bg-surface-3 text-fg-subtle"}`}
    >
      {status}
    </span>
  );
}

/** "administrator" → "Administrator" */
export const roleLabel = (role: string): string => role.charAt(0).toUpperCase() + role.slice(1);
