/**
 * Owns the signed-in session while the app runs:
 *  - authRequest(): signed-in requests; on 401 it refreshes once and retries.
 *  - Refreshes ~60s before the access token expires, and again when the tab wakes up.
 *  - Only ONE refresh at a time: within a tab (shared promise) and across tabs (Web Locks).
 *    The server rotates refresh tokens, so two tabs refreshing with the same token would break the session.
 *  - Tabs stay in sync through the `storage` event (new tokens, sign-out).
 */
import { type LoginTokenData, refresh } from "./auth";
import { BackendError, request } from "./client";
import { loadTokens, parseTokens, saveTokens, TOKENS_KEY, type Tokens } from "./tokens";

/** Why the session ended, so the login page can explain it. */
export type EndReason = "signed-out" | "expired";

/** Thrown when there is no usable session any more; the user must sign in again. */
export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

/** `external`: the change came from another tab. */
type Listener = (tokens: Tokens | null, reason: EndReason | undefined, external: boolean) => void;

const REFRESH_EARLY_MS = 60_000; // refresh this long before the access token expires
const RETRY_AFTER_FAILURE_MS = 30_000; // proactive refresh failed (e.g. offline): try again later
const LOCK_NAME = "restling.refresh";

let current: Tokens | null = loadTokens();
let inFlight: Promise<Tokens> | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
/** When the next proactive refresh is due (epoch ms). */
let dueAt = Number.POSITIVE_INFINITY;
const listeners = new Set<Listener>();

export const getTokens = (): Tokens | null => current;

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toTokens(data: LoginTokenData): Tokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    refreshExpiresAt: Date.parse(data.refresh_expires_at) || Number.POSITIVE_INFINITY,
    sessionId: data.session_id,
  };
}

/** Start a session (after login) or end it (null). Saved, scheduled and broadcast to listeners. */
export function setSession(tokens: Tokens | null, reason?: EndReason): void {
  apply(tokens, reason);
  saveTokens(tokens);
}

/** Update this tab's state without writing storage (used for changes that came from another tab). */
function apply(tokens: Tokens | null, reason?: EndReason, external = false): void {
  current = tokens;
  schedule();
  for (const listener of listeners) listener(tokens, reason, external);
}

function expire(): never {
  setSession(null, "expired");
  throw new SessionExpiredError();
}

/** Run fn while holding a lock shared by every tab of this app (falls back to no lock where unsupported). */
function withCrossTabLock<T>(fn: () => Promise<T>): Promise<T> {
  return typeof navigator !== "undefined" && navigator.locks ? navigator.locks.request(LOCK_NAME, fn) : fn();
}

async function doRefresh(): Promise<Tokens> {
  const planned = current;
  if (!planned || planned.refreshExpiresAt <= Date.now()) expire();

  return withCrossTabLock(async () => {
    // While we waited for the lock, another tab may already have rotated the tokens. Use theirs.
    const stored = loadTokens();
    if (!stored) expire();
    if (stored.refreshToken !== planned.refreshToken) {
      apply(stored);
      return stored;
    }

    try {
      const next = toTokens(await refresh(stored.refreshToken));
      setSession(next);
      return next;
    } catch (error) {
      // 401 = refresh token invalid/expired/revoked: the session is over. Anything else (offline) is retryable.
      if (error instanceof BackendError && error.status === 401) expire();
      throw error;
    }
  });
}

/** Refresh the tokens. Concurrent callers in this tab share one request. */
export function refreshTokens(): Promise<Tokens> {
  inFlight ??= doRefresh().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

type AuthRequestOptions = Omit<NonNullable<Parameters<typeof request>[1]>, "token">;

/** A request that needs the signed-in user. Refreshes once on 401 and retries; a second 401 ends the session. */
export async function authRequest<T>(path: string, options: AuthRequestOptions = {}): Promise<T> {
  let tokens = current;
  if (!tokens) throw new SessionExpiredError();
  if (tokens.expiresAt - Date.now() < 5_000) tokens = await refreshTokens(); // about to expire: don't bother

  try {
    return await request<T>(path, { ...options, token: tokens.accessToken });
  } catch (error) {
    if (!(error instanceof BackendError) || error.status !== 401) throw error;
  }

  tokens = await refreshTokens();
  try {
    return await request<T>(path, { ...options, token: tokens.accessToken });
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) expire();
    throw error;
  }
}

/**
 * Refresh shortly before the access token expires: 60s early, or halfway through
 * for very short-lived tokens (so a 30s token doesn't refresh in a tight loop).
 */
function schedule(): void {
  clearTimeout(timer);
  dueAt = Number.POSITIVE_INFINITY;
  if (!current) return;
  const remaining = current.expiresAt - Date.now();
  const delay = Math.max(0, remaining - REFRESH_EARLY_MS, remaining / 2);
  dueAt = Date.now() + delay;
  timer = setTimeout(refreshInBackground, delay);
}

function refreshInBackground(): void {
  refreshTokens().catch((error: unknown) => {
    if (error instanceof SessionExpiredError) return; // listeners already moved the UI to the login page
    clearTimeout(timer);
    timer = setTimeout(refreshInBackground, RETRY_AFTER_FAILURE_MS);
  });
}

/** Timers don't run while a laptop sleeps: check again when the tab becomes active. */
function onWake(): void {
  if (document.visibilityState !== "visible" || !current) return;
  if (Date.now() >= dueAt) refreshInBackground();
}

/** Another tab changed the tokens (refreshed, signed in or signed out). */
function onStorage(event: StorageEvent): void {
  if (event.key !== TOKENS_KEY && event.key !== null) return;
  const next = parseTokens(event.newValue);
  if (next?.refreshToken === current?.refreshToken) return;
  apply(next, next ? undefined : "signed-out", true);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onWake);
  document.addEventListener("visibilitychange", onWake);
  schedule();
}
