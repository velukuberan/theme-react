import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  /** Optional controls shown on the right of the header (filters, buttons). */
  actions?: ReactNode;
  children: ReactNode;
};

/** A card with a titled header, used on settings-style pages. */
export function Section({ title, description, actions, children }: Props) {
  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="text-xs text-fg-subtle">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
