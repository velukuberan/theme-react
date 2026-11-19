import { useState } from "react";
import type { SessionsPage } from "../../backend/users";
import { useAsync } from "../../hooks/useAsync";
import { errorMessage, formatDate, timeAgo } from "../../lib/format";
import { Button } from "../forms/Button";
import { Section } from "../Section";
import { deviceName, ipAddress, newestFirst, Time } from "./sessionDisplay";

/** A "sign out many" action. Profile: all *other* sessions. Admin: all of a user's sessions. */
export type BulkSignOut = {
  /** Button label, e.g. "Sign out all other sessions". */
  label: string;
  /** Which sessions it signs out, for the count and the confirmation. */
  scope: "others" | "all";
  /** Runs it and returns the message to show, e.g. "Signed out 3 sessions." */
  run: () => Promise<string>;
};

type Props = {
  description: string;
  /** Loads the active sessions. */
  load: () => Promise<SessionsPage>;
  /** Signs out one session. Left out: no per-session Sign out buttons. */
  revokeOne?: (sessionId: string) => Promise<void>;
  /** Left out: no bulk sign-out button. */
  bulk?: BulkSignOut;
  /** Bumped by the parent after any change, so this list reloads. */
  version: number;
  /** Tell the parent something changed (so the history reloads too). */
  onChanged: () => void;
};

/** Active sessions as cards, with optional sign-out actions. Used by the profile and by the admin user page. */
export function ActiveSessions({ description, load, revokeOne, bulk, version, onChanged }: Props) {
  const { data, error, loading } = useAsync(load, [version]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  // This device first, then newest first.
  const sessions = [...(data?.data ?? [])].sort(
    (a, b) => Number(b.is_current) - Number(a.is_current) || newestFirst(a, b),
  );
  const includesCurrent = sessions.some((s) => s.is_current);
  const bulkCount = bulk?.scope === "others" ? sessions.filter((s) => !s.is_current).length : sessions.length;

  const run = async (id: string, action: () => Promise<string>) => {
    setBusyId(id);
    setActionError("");
    setNotice("");
    try {
      setNotice(await action());
      onChanged();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
      setConfirming(false);
    }
  };

  const signOutOne = (id: string) =>
    run(id, async () => {
      await revokeOne?.(id);
      return "Session signed out.";
    });

  const plural = (n: number) => `${n} ${n === 1 ? "session" : "sessions"}`;

  return (
    <Section title="Active sessions" description={description}>
      <div className="space-y-4">
        {notice && (
          <p role="status" className="rounded-md border border-ok/40 bg-ok/10 px-3 py-2 text-ok">
            {notice}
          </p>
        )}
        {(error || actionError) && (
          <p role="alert" className="text-xs text-err">
            {actionError || errorMessage(error)}
          </p>
        )}

        {loading && !data ? (
          <p className="text-fg-subtle">Loading sessions…</p>
        ) : sessions.length === 0 ? (
          <p className="text-fg-subtle">No active sessions.</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {sessions.map((s) => (
              <li key={s.session_id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate">{deviceName(s)}</span>
                    {s.is_current && (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-fg-subtle">
                    {ipAddress(s)} · Signed in <Time iso={s.created_at}>{formatDate(s.created_at)}</Time> ·{" "}
                    {s.is_current ? (
                      "Active now"
                    ) : (
                      <>
                        Last active{" "}
                        <Time iso={s.last_used_at ?? s.created_at}>{timeAgo(s.last_used_at ?? s.created_at)}</Time>
                      </>
                    )}
                  </p>
                </div>
                {revokeOne && !s.is_current && (
                  <Button variant="secondary" disabled={busyId !== null} onClick={() => void signOutOne(s.session_id)}>
                    {busyId === s.session_id ? "Signing out…" : "Sign out"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}

        {bulk && bulkCount > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {confirming ? (
              <>
                <span className="text-xs text-fg-muted">
                  Sign out {bulk.scope === "others" ? "the other " : ""}
                  {plural(bulkCount)}?{bulk.scope === "all" && includesCurrent && " This includes this device."}
                </span>
                <Button variant="secondary" disabled={busyId !== null} onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
                <Button disabled={busyId !== null} onClick={() => void run("bulk", bulk.run)}>
                  {busyId === "bulk" ? "Signing out…" : "Yes, sign out"}
                </Button>
              </>
            ) : (
              <Button variant="secondary" disabled={busyId !== null} onClick={() => setConfirming(true)}>
                {bulk.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
