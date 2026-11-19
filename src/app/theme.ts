export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "apiconsole.theme";
const THEMES: readonly Theme[] = ["system", "light", "dark"];
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** The theme the user picked (may be "system"). */
export function getTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : "system";
}

/** What is actually on screen right now: always "light" or "dark". */
export function getResolvedTheme(theme: Theme = getTheme()): "light" | "dark" {
  if (theme !== "system") return theme;
  return systemDark.matches ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage can be unavailable (private mode, some webviews): the theme still applies for this visit
  }
  syncButtons();
}

function syncButtons(): void {
  const theme = getTheme();
  document.querySelectorAll<HTMLButtonElement>("[data-theme-value]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.themeValue === theme));
  });
  const systemBtn = document.querySelector<HTMLButtonElement>('[data-theme-value="system"]');
  if (systemBtn) systemBtn.title = `System theme (currently ${getResolvedTheme("system")})`;
}

/** Wire up every element with data-theme-value="…" as a theme button. */
export function initThemeSwitcher(): void {
  document.addEventListener("click", (event) => {
    const btn = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-theme-value]");
    if (btn && isTheme(btn.dataset.themeValue)) setTheme(btn.dataset.themeValue);
  });
  // colours follow the OS automatically through CSS; this only keeps the tooltip accurate
  systemDark.addEventListener("change", syncButtons);
  syncButtons();
}
