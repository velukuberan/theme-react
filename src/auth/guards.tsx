import { Navigate, Outlet, useLocation } from "react-router";
import { Button } from "../components/forms/Button";
import { useAuth } from "./AuthContext";

/** Shown while a saved session is being checked, so the login page doesn't flash. */
function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas">
      <span className="grid size-10 animate-pulse place-items-center rounded-lg bg-accent font-mono text-base font-semibold text-on-accent">
        {"{ }"}
      </span>
    </div>
  );
}

/** We have a saved session but the server didn't answer. Keep the session and let the user retry. */
function Offline() {
  const { retry, signOut } = useAuth();
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas p-4">
      <div className="max-w-sm space-y-4 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-lg bg-accent font-mono text-base font-semibold text-on-accent">
          {"{ }"}
        </span>
        <div>
          <h1 className="text-lg font-semibold">Can't reach the server</h1>
          <p className="text-fg-subtle">
            You're still signed in. Check that the Restling Server is running, then retry.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={retry}>Retry</Button>
          <Button variant="secondary" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Only signed-in users get through; everyone else goes to /login (and comes back afterwards). */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <Splash />;
  if (status === "offline") return <Offline />;
  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

/**
 * Login/register are pointless once signed in: send those users into the app,
 * back to the page RequireAuth sent them from (if any). This is also what moves
 * the user on after a successful sign-in.
 */
export function GuestOnly() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <Splash />;
  if (status === "offline") return <Offline />;
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  return status === "authenticated" ? <Navigate to={from} replace /> : <Outlet />;
}
