import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "apiconsole.theme";
const THEMES: readonly Theme[] = ["system", "light", "dark"];
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);

/** The inline script in index.html has already applied the saved theme; start from that. */
const readInitialTheme = (): Theme => {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : "system";
};

/** Subscribes to the OS light/dark setting; re-renders when it changes. */
function useSystemPrefersDark(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      darkQuery.addEventListener("change", onChange);
      return () => darkQuery.removeEventListener("change", onChange);
    },
    () => darkQuery.matches,
  );
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const systemDark = useSystemPrefersDark();

  // Keep <html data-theme="…"> and localStorage in sync with React state.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (private mode, some webviews): the theme still applies for this visit
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  /** What is actually on screen: always "light" or "dark". */
  const resolved: "light" | "dark" = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  return { theme, setTheme, resolved } as const;
}
