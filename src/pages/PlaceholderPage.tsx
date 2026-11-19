import type { ComponentType, SVGProps } from "react";

type Props = {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Temporary page body for routes that exist but have no content yet. */
export function PlaceholderPage({ title, description, Icon }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface p-10 text-center">
          <Icon className="size-8 text-fg-subtle" />
          <p className="text-fg-muted">{description}</p>
          <p className="text-xs text-fg-subtle">Coming soon.</p>
        </div>
      </div>
    </div>
  );
}
