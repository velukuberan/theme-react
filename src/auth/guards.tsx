import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

/** Only signed-in users get through; everyone else goes to /login (and comes back afterwards). */
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

/** Login/register are pointless once signed in: send those users into the app. */
export function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
