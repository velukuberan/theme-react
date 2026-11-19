import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as backend from "../backend/auth";
import { BackendError } from "../backend/client";
import { loadTokens, saveTokens, type Tokens } from "../backend/tokens";

/**
 * Sign-in talks to the Restling Server (POST /auth/login, GET /users/me, POST /auth/logout).
 * Register and profile updates are still fake: the server has no endpoints for them yet in this UI.
 */
export type User = backend.UserDetail;

/** "loading" while a saved token is being checked on startup. */
export type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Fake for now: updates the local copy only. */
  updateProfile: (changes: Pick<User, "display_name" | "job_title">) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Tokens | null>(loadTokens);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => (loadTokens() ? "loading" : "anonymous"));

  const clearSession = useCallback(() => {
    saveTokens(null);
    setTokens(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  // On startup: if a token was saved, ask the server who it belongs to.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once with the tokens loaded at startup
  useEffect(() => {
    if (!tokens) return;
    let cancelled = false;
    backend
      .getMe(tokens.accessToken)
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        // 401 (expired/revoked) or server unreachable: start signed out.
        if (!cancelled) clearSession();
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await backend.login(email, password);
    const next: Tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      sessionId: data.session_id,
    };
    const me = await backend.getMe(next.accessToken);
    saveTokens(next);
    setTokens(next);
    setUser(me);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    const token = tokens?.accessToken;
    clearSession();
    if (token) {
      // Best effort: the local session is already gone even if the server can't be reached.
      await backend.logout(token).catch((error: unknown) => {
        if (!(error instanceof BackendError)) throw error;
      });
    }
  }, [tokens, clearSession]);

  const updateProfile = useCallback((changes: Pick<User, "display_name" | "job_title">) => {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signIn, signOut, updateProfile }),
    [status, user, signIn, signOut, updateProfile],
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
