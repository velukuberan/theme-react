import type { ReactNode } from "react";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Full-screen centred card shared by the login and register pages (no app shell). */
export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="relative grid min-h-dvh place-items-center bg-canvas p-4">
      <div className="absolute top-3 right-3">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid size-10 place-items-center rounded-lg bg-accent font-mono text-base font-semibold text-on-accent">
            {"{ }"}
          </span>
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-fg-subtle">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">{children}</div>

        <p className="mt-4 text-center text-fg-subtle">{footer}</p>
      </div>
    </div>
  );
}
