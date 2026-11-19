import type { ComponentType, SVGProps } from "react";
import { EnvIcon, FolderIcon, HistoryIcon } from "../icons";

const ITEMS: { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; current?: boolean }[] = [
  { label: "APIs", Icon: FolderIcon, current: true },
  { label: "Env", Icon: EnvIcon },
  { label: "History", Icon: HistoryIcon },
];

export function IconRail() {
  return (
    <nav
      aria-label="Sections"
      className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-surface py-2 md:flex"
    >
      {ITEMS.map(({ label, Icon, current }) => (
        <button
          key={label}
          type="button"
          aria-current={current ? "page" : undefined}
          className="flex w-12 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] text-fg-subtle hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
        >
          <Icon className="size-[18px]" />
          {label}
        </button>
      ))}
    </nav>
  );
}
