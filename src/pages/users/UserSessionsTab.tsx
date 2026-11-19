import { useCallback, useState } from "react";
import { useCan } from "../../auth/permissions";
import { listUserSessions, revokeAllUserSessions, revokeUserSession } from "../../backend/admin";
import type { SessionStatus } from "../../backend/users";
import { ActiveSessions, type BulkSignOut } from "../../components/sessions/ActiveSessions";
import { SessionHistory } from "../../components/sessions/SessionHistory";
import { useViewedUser } from "./UserLayout";

/** A user's sessions. Signing them out is for administrators only (users.manage), checked here too. */
export function UserSessionsTab() {
  const user = useViewedUser();
  const can = useCan();
  const canSignOut = can("users.manage");
  const [version, setVersion] = useState(0);

  const loadActive = useCallback(() => listUserSessions(user.id, { status: "active", limit: 100 }), [user.id]);
  const loadHistory = useCallback(
    (params: { limit: number; offset: number; status?: SessionStatus }) => listUserSessions(user.id, params),
    [user.id],
  );

  const signOutAll: BulkSignOut = {
    label: "Sign out all sessions",
    scope: "all",
    run: async () => {
      await revokeAllUserSessions(user.id);
      return `Signed out all of ${user.display_name}'s sessions.`;
    },
  };

  return (
    <div className="space-y-5">
      <ActiveSessions
        description={`Devices where ${user.display_name} is signed in.`}
        load={loadActive}
        revokeOne={canSignOut ? (sessionId) => revokeUserSession(user.id, sessionId) : undefined}
        bulk={canSignOut ? signOutAll : undefined}
        version={version}
        onChanged={() => setVersion((v) => v + 1)}
      />
      <SessionHistory
        description={`Every sign-in by ${user.display_name}, newest first.`}
        load={loadHistory}
        version={version}
      />
    </div>
  );
}
