import type { ComponentType, SVGProps } from "react";
import { EnvIcon, FolderIcon, HistoryIcon } from "../icons";

export type View = "apis" | "env" | "history" | "help" | "settings";

export const SECTIONS: { id: View; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "apis", label: "APIs", Icon: FolderIcon },
  { id: "env", label: "Env", Icon: EnvIcon },
  { id: "history", label: "History", Icon: HistoryIcon },
  { id: "help", label: "Help", Icon: HistoryIcon },
  { id: "settings", label: "Settings", Icon: HistoryIcon },
];

type Props = {
  active: View | null;
  onSelect: (view: View) => void;
};

export function IconRail({ active, onSelect }: Props) {
  return (
    <nav
      aria-label="Sections"
      className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-surface py-2 md:flex"
    >
      {SECTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          aria-pressed={active === id}
          aria-current={active === id ? "page" : undefined}
          className="flex w-12 cursor-pointer flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] text-fg-subtle hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
        >
          <Icon className="size-[18px]" />
          {label}
        </button>
      ))}
    </nav>
  );
}
