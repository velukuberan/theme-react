import { useState } from "react";
import { ActiveSessions } from "./ActiveSessions";
import { SessionHistory } from "./SessionHistory";

/** Active sessions on top, full history below. Signing a session out reloads both. */
export function SessionsTab() {
  const [version, setVersion] = useState(0);
  return (
    <div className="space-y-5">
      <ActiveSessions version={version} onChanged={() => setVersion((v) => v + 1)} />
      <SessionHistory version={version} />
    </div>
  );
}
