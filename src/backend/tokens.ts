/**
 * The ONLY place the Restling Server tokens are stored.
 * localStorage for now; swap this file for an httpOnly cookie (web) or the OS keychain (Tauri) later.
 */
export type Tokens = {
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds when the access token expires. */
  expiresAt: number;
  sessionId: string;
};

const KEY = "restling.tokens";
const LEGACY_KEYS = ["apiconsole.session"]; // the old fake session

export function loadTokens(): Tokens | null {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Tokens>;
    return typeof parsed.accessToken === "string" && typeof parsed.refreshToken === "string"
      ? (parsed as Tokens)
      : null;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: Tokens | null): void {
  try {
    if (tokens) localStorage.setItem(KEY, JSON.stringify(tokens));
    else localStorage.removeItem(KEY);
  } catch {
    // storage unavailable: the session just won't survive a reload
  }
}
