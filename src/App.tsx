import { useEffect } from "react";
import { initThemeSwitcher } from "./app/theme";

export function App() {
  // Temporary: reuse the existing theme module until it becomes a React hook in the next step.
  useEffect(() => {
    initThemeSwitcher();
  }, []);

  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">React is running</h1>

        <div className="flex gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label="Theme">
          {(["system", "light", "dark"] as const).map((t) => (
            <button
              key={t}
              data-theme-value={t}
              className="rounded-md px-3 py-1 text-sm text-fg-subtle capitalize hover:text-fg aria-pressed:bg-canvas aria-pressed:text-accent"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <p>Tailwind and the theme colours work inside React components.</p>
        <p className="text-fg-muted">Next step: move the layout into components.</p>
        <button className="rounded-lg bg-accent px-5 py-2 font-semibold text-on-accent hover:bg-accent-hover">Send</button>
      </div>
    </main>
  );
}
