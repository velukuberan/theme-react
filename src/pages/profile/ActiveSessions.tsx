import { useState } from "react";
import { listMySessions, revokeMyOtherSessions, revokeMySession } from "../../backend/users";
import { Button } from "../../components/forms/Button";
import { Section } from "../../components/Section";
import { useAsync } from "../../hooks/useAsync";
import { errorMessage, formatDate, timeAgo } from "../../lib/format";
import { deviceName, ipAddress, newestFirst, Time } from "./sessionDisplay";

type Props = {
  /** Bumped by the parent after any change, so this list reloads. */
  version: number;
  /** Tell the parent something changed (so the history reloads too). */
  onChanged: () => void;
};

export function ActiveSessions({ version, onChanged }: Props) {
  const { data, error, loading } = useAsync(() => listMySessions({ status: "active", limit: 100 }), [version]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  // This device first, then newest first.
  const sessions = [...(data?.data ?? [])].sort(
    (a, b) => Number(b.is_current) - Number(a.is_current) || newestFirst(a, b),
  );
  const others = sessions.filter((s) => !s.is_current).length;

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
      await revokeMySession(id);
      return "Session signed out.";
    });

  const signOutOthers = () =>
    run("others", async () => {
      const count = await revokeMyOtherSessions();
      return `Signed out ${count} other ${count === 1 ? "session" : "sessions"}.`;
    });

  return (
    <Section title="Active sessions" description="Devices currently signed in to your account.">
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
                {!s.is_current && (
                  <Button variant="secondary" disabled={busyId !== null} onClick={() => void signOutOne(s.session_id)}>
                    {busyId === s.session_id ? "Signing out…" : "Sign out"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}

        {others > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {confirming ? (
              <>
                <span className="text-xs text-fg-muted">
                  Sign out {others} other {others === 1 ? "session" : "sessions"}?
                </span>
                <Button variant="secondary" disabled={busyId !== null} onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
                <Button disabled={busyId !== null} onClick={() => void signOutOthers()}>
                  {busyId === "others" ? "Signing out…" : "Yes, sign them out"}
                </Button>
              </>
            ) : (
              <Button variant="secondary" disabled={busyId !== null} onClick={() => setConfirming(true)}>
                Sign out all other sessions
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
