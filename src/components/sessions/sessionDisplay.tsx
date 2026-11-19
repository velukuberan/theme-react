import type { SessionStatus, UserSession } from "../../backend/users";
import { formatDateTime } from "../../lib/format";

/** machine_name is empty for now; show a dash until the server fills it. */
export const deviceName = (s: UserSession): string => s.machine_name?.trim() || "—";

export const ipAddress = (s: UserSession): string => s.last_seen_ip ?? s.login_ip ?? "—";

/** When the session stopped working: revoked, or expired. */
export const endedAt = (s: UserSession): string | null =>
  s.revoked_at ?? (s.status === "expired" ? s.expires_at : null);

/** Newest first. The API has no sort parameter, so we also sort each page we receive. */
export const newestFirst = (a: UserSession, b: UserSession): number => b.created_at.localeCompare(a.created_at);

const STATUS_STYLE: Record<SessionStatus, string> = {
  active: "bg-ok/12 text-ok",
  revoked: "bg-err/12 text-err",
  expired: "bg-surface-3 text-fg-subtle",
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

/** A date with the full date and time as a tooltip. */
export function Time({ iso, children }: { iso: string; children: string }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)}>
      {children}
    </time>
  );
}
