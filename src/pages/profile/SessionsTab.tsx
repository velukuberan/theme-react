import { useState } from "react";
import { listMySessions, revokeMyOtherSessions, revokeMySession } from "../../backend/users";
import { ActiveSessions } from "../../components/sessions/ActiveSessions";
import { SessionHistory } from "../../components/sessions/SessionHistory";

const loadActive = () => listMySessions({ status: "active", limit: 100 });

const signOutOthers = {
  label: "Sign out all other sessions",
  scope: "others",
  run: async () => {
    const count = await revokeMyOtherSessions();
    return `Signed out ${count} other ${count === 1 ? "session" : "sessions"}.`;
  },
} as const;

/** Your own sessions: active ones on top, full history below. Signing a session out reloads both. */
export function SessionsTab() {
  const [version, setVersion] = useState(0);
  return (
    <div className="space-y-5">
      <ActiveSessions
        description="Devices currently signed in to your account."
        load={loadActive}
        revokeOne={revokeMySession}
        bulk={signOutOthers}
        version={version}
        onChanged={() => setVersion((v) => v + 1)}
      />
      <SessionHistory
        description="Every sign-in to your account, newest first."
        load={listMySessions}
        version={version}
      />
    </div>
  );
}
