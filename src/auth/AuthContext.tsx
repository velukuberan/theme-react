import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as auth from "../backend/auth";
import { BackendError } from "../backend/client";
import { type EndReason, getTokens, SessionExpiredError, setSession, subscribe, toTokens } from "../backend/session";
import { getMe, type UserDetail } from "../backend/users";

/**
 * Sign-in talks to the Restling Server; the session layer (backend/session.ts) keeps it alive with the refresh token.
 * Register and profile updates are still fake: the server has no endpoints for them yet in this UI.
 */
export type User = UserDetail;

/**
 * loading:       checking a saved session on startup
 * authenticated: signed in
 * anonymous:     signed out (see endReason for why)
 * offline:       we have a session but couldn't reach the server to confirm it; the user can retry
 */
export type AuthStatus = "loading" | "authenticated" | "anonymous" | "offline";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  /** Set when the session ended on its own (e.g. "expired"), so the login page can say why. */
  endReason: EndReason | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Try again to confirm the saved session (from the offline screen). */
  retry: () => void;
  /** Fake for now: updates the local copy only. */
  updateProfile: (changes: Pick<User, "display_name" | "job_title">) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => (getTokens() ? "loading" : "anonymous"));
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  /** Confirm the current session with the server and load the user. */
  const loadSession = useCallback(async () => {
    if (!getTokens()) {
      setStatus("anonymous");
      return;
    }
    setStatus("loading");
    try {
      setUser(await getMe()); // refreshes first if the access token has expired
      setEndReason(null);
      setStatus("authenticated");
    } catch (error) {
      if (error instanceof SessionExpiredError) return; // the session listener below already signed us out
      // Server unreachable or failing: keep the tokens, the session may still be perfectly valid.
      setStatus("offline");
    }
  }, []);

  // Startup, plus: follow session changes made by the session layer or by another tab.
  useEffect(() => {
    void loadSession();
    return subscribe((tokens, reason, external) => {
      if (!tokens) {
        setUser(null);
        setStatus("anonymous");
        if (reason === "expired") setEndReason("expired");
        return;
      }
      // Signed in from another tab while this one was signed out: pick that session up.
      if (external && statusRef.current === "anonymous") void loadSession();
    });
  }, [loadSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    setSession(toTokens(await auth.login(email, password)));
    try {
      setUser(await getMe());
    } catch (error) {
      setSession(null); // don't keep half a session
      throw error;
    }
    setEndReason(null);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    const accessToken = getTokens()?.accessToken;
    setSession(null, "signed-out"); // local first: signed out even if the server can't be reached
    setEndReason(null);
    if (accessToken) {
      await auth.logout(accessToken).catch((error: unknown) => {
        if (!(error instanceof BackendError)) throw error;
      });
    }
  }, []);

  const retry = useCallback(() => void loadSession(), [loadSession]);

  const updateProfile = useCallback((changes: Pick<User, "display_name" | "job_title">) => {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, endReason, signIn, signOut, retry, updateProfile }),
    [status, user, endReason, signIn, signOut, retry, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** "Velu Kuberan" → "VK" */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
