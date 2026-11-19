import type { ReactNode } from "react";
import { Section } from "../../components/Section";
import { formatDateTime } from "../../lib/format";
import { useViewedUser } from "./UserLayout";
import { roleLabel, UserStatusBadge } from "./userDisplay";

/** Read-only for now; editing comes in a later PR. */
export function UserDetailsTab() {
  const user = useViewedUser();

  const rows: [string, ReactNode][] = [
    ["Display name", user.display_name],
    ["Email", user.email],
    ["Job title", user.job_title ?? "—"],
    ["Role", roleLabel(user.system_role)],
    ["Status", <UserStatusBadge key="status" status={user.status} />],
    ["Created", formatDateTime(user.created_at)],
    ["Activated", user.activated_at ? formatDateTime(user.activated_at) : "Not yet"],
    ["Last updated", formatDateTime(user.updated_at)],
    ["Password reset required", user.password_reset_required ? "Yes" : "No"],
  ];

  return (
    <Section title="Details" description="Account information for this user.">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[12rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-xs font-medium text-fg-subtle sm:py-0.5">{label}</dt>
            <dd className="mb-2 sm:mb-0">{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
