import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

/** Shown while a saved token is being checked, so the login page doesn't flash. */
function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas">
      <span className="grid size-10 animate-pulse place-items-center rounded-lg bg-accent font-mono text-base font-semibold text-on-accent">
        {"{ }"}
      </span>
    </div>
  );
}

/** Only signed-in users get through; everyone else goes to /login (and comes back afterwards). */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <Splash />;
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
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  return status === "authenticated" ? <Navigate to={from} replace /> : <Outlet />;
}
