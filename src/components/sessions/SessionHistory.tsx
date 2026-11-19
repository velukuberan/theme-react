import { useSearchParams } from "react-router";
import type { SessionStatus, SessionsPage } from "../../backend/users";
import { useAsync } from "../../hooks/useAsync";
import { errorMessage, formatDate, timeAgo } from "../../lib/format";
import { Pagination } from "../Pagination";
import { Section } from "../Section";
import { deviceName, endedAt, ipAddress, newestFirst, StatusBadge, Time } from "./sessionDisplay";

const PAGE_SIZE = 25;
const FILTERS: { value: SessionStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "revoked", label: "Revoked" },
  { value: "expired", label: "Expired" },
];

const isStatus = (value: string | null): value is SessionStatus =>
  value === "active" || value === "revoked" || value === "expired";

type Props = {
  description: string;
  /** Loads one page of sessions. */
  load: (params: { limit: number; offset: number; status?: SessionStatus }) => Promise<SessionsPage>;
  /** Bumped by the parent after any change, so the history reloads. */
  version: number;
};

/** All sessions, newest first, paginated. Page and filter live in the URL (?page=2&status=revoked). */
export function SessionHistory({ description, load, version }: Props) {
  const [params, setParams] = useSearchParams();
  const status = isStatus(params.get("status")) ? (params.get("status") as SessionStatus) : undefined;
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);

  const { data, error, loading } = useAsync(
    () => load({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, status }),
    [page, status, version],
  );
  const sessions = [...(data?.data ?? [])].sort(newestFirst);

  const update = (next: { page?: number; status?: SessionStatus | "" }) => {
    const p = new URLSearchParams(params);
    if (next.status !== undefined) {
      if (next.status) p.set("status", next.status);
      else p.delete("status");
      p.delete("page"); // a new filter starts on page 1
    }
    if (next.page !== undefined) {
      if (next.page > 1) p.set("page", String(next.page));
      else p.delete("page");
    }
    setParams(p);
  };

  const filters = (
    <fieldset className="flex gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5 text-xs">
      <legend className="sr-only">Filter by status</legend>
      {FILTERS.map(({ value, label }) => (
        <button
          key={label}
          type="button"
          aria-pressed={(status ?? "") === value}
          onClick={() => update({ status: value })}
          className="rounded-md px-2.5 py-1 text-fg-subtle hover:text-fg aria-pressed:bg-canvas aria-pressed:text-fg"
        >
          {label}
        </button>
      ))}
    </fieldset>
  );

  return (
    <Section title="Session history" description={description} actions={filters}>
      <div className={`space-y-4 transition-opacity ${loading && data ? "opacity-60" : ""}`}>
        {error ? (
          <p role="alert" className="text-xs text-err">
            {errorMessage(error)}
          </p>
        ) : null}

        {loading && !data ? (
          <p className="text-fg-subtle">Loading history…</p>
        ) : sessions.length === 0 ? (
          <p className="text-fg-subtle">No sessions found.</p>
        ) : (
          <>
            {/* Table from md up */}
            <table className="hidden w-full text-left md:table">
              <thead className="text-xs text-fg-subtle">
                <tr className="border-b border-line">
                  <th className="py-2 pr-3 font-medium">Device</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Signed in</th>
                  <th className="py-2 pr-3 font-medium">Last active</th>
                  <th className="py-2 pr-3 font-medium">Ended</th>
                  <th className="py-2 font-medium">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sessions.map((s) => {
                  const ended = endedAt(s);
                  const lastActive = s.last_used_at ?? s.created_at;
                  return (
                    <tr key={s.session_id}>
                      <td className="py-2 pr-3">
                        {deviceName(s)}
                        {s.is_current && <span className="ml-2 text-[11px] text-accent">This device</span>}
                      </td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-2 pr-3 text-fg-muted">
                        <Time iso={s.created_at}>{formatDate(s.created_at)}</Time>
                      </td>
                      <td className="py-2 pr-3 text-fg-muted">
                        <Time iso={lastActive}>{timeAgo(lastActive)}</Time>
                      </td>
                      <td className="py-2 pr-3 text-fg-muted">
                        {ended ? <Time iso={ended}>{formatDate(ended)}</Time> : "—"}
                      </td>
                      <td className="py-2 font-mono text-xs text-fg-muted">{ipAddress(s)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Cards below md */}
            <ul className="space-y-2 md:hidden">
              {sessions.map((s) => {
                const ended = endedAt(s);
                return (
                  <li key={s.session_id} className="rounded-lg border border-line px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{deviceName(s)}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-fg-subtle">
                      Signed in <Time iso={s.created_at}>{formatDate(s.created_at)}</Time>
                      {ended && (
                        <>
                          {" "}
                          · Ended <Time iso={ended}>{formatDate(ended)}</Time>
                        </>
                      )}{" "}
                      · {ipAddress(s)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {data && data.pagination.total > 0 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={data.pagination.total}
            onChange={(next) => update({ page: next })}
          />
        )}
      </div>
    </Section>
  );
}
