import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * FAKE auth for the UI phase: no server, no real passwords.
 * Any email/password signs you in; the "session" is just the user object in localStorage.
 * Swap the bodies of signIn/register/signOut for real API calls later — the context shape can stay.
 */
export type User = {
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  signOut: () => void;
  updateProfile: (changes: Pick<User, "name" | "email">) => void;
};

const SESSION_KEY = "apiconsole.session";
const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable: the session just won't survive a reload
  }
}

/** "velu.k@example.com" → "Velu K" */
const nameFromEmail = (email: string): string =>
  email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ") || email;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const update = useCallback((next: User | null) => {
    saveUser(next);
    setUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: (email) => update({ name: nameFromEmail(email), email, role: "Admin" }),
      register: (name, email) => update({ name, email, role: "Admin" }),
      signOut: () => update(null),
      updateProfile: (changes) => user && update({ ...user, ...changes }),
    }),
    [user, update],
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
