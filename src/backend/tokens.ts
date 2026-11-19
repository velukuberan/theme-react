/**
 * The ONLY place the Restling Server tokens are stored.
 * localStorage for now; swap this file for an httpOnly cookie (web) or the OS keychain (Tauri) later.
 */
export type Tokens = {
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds when the access token expires. */
  expiresAt: number;
  /** Epoch milliseconds when the refresh token expires (the session's hard end). */
  refreshExpiresAt: number;
  sessionId: string;
};

export const TOKENS_KEY = "restling.tokens";
const LEGACY_KEYS = ["apiconsole.session"]; // the old fake session

/** Parse a stored value; anything malformed counts as "no session". */
export function parseTokens(raw: string | null): Tokens | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Tokens>;
    if (typeof parsed.accessToken !== "string" || typeof parsed.refreshToken !== "string") return null;
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: Number(parsed.expiresAt) || 0,
      // Tokens saved before this field existed: let the server decide when the refresh token is used.
      refreshExpiresAt: Number(parsed.refreshExpiresAt) || Number.POSITIVE_INFINITY,
      sessionId: String(parsed.sessionId ?? ""),
    };
  } catch {
    return null;
  }
}

export function loadTokens(): Tokens | null {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
    return parseTokens(localStorage.getItem(TOKENS_KEY));
  } catch {
    return null;
  }
}

export function saveTokens(tokens: Tokens | null): void {
  try {
    if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    else localStorage.removeItem(TOKENS_KEY);
  } catch {
    // storage unavailable: the session just won't survive a reload
  }
}
