import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router";
import { EnvIcon, FolderIcon, HelpIcon, HistoryIcon, SettingsIcon } from "../icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Sidebar panels: things you browse while you work. */
export type View = "apis" | "env" | "history";

export const SECTIONS: { id: View; label: string; Icon: IconComponent }[] = [
  { id: "apis", label: "APIs", Icon: FolderIcon },
  { id: "env", label: "Env", Icon: EnvIcon },
  { id: "history", label: "History", Icon: HistoryIcon },
];

/** Full pages, pinned to the bottom of the rail (Settings last, by convention). */
export const PAGE_LINKS: { to: string; label: string; Icon: IconComponent }[] = [
  { to: "/help", label: "Help", Icon: HelpIcon },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

const ITEM_CLASS =
  "flex w-12 cursor-pointer flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] text-fg-subtle hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent";

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
          className={ITEM_CLASS}
        >
          <Icon className="size-[18px]" />
          {label}
        </button>
      ))}

      {/* mt-auto pushes these to the bottom. NavLink sets aria-current="page" on the active route. */}
      <div className="mt-auto flex flex-col items-center gap-1">
        {PAGE_LINKS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={ITEM_CLASS}>
            <Icon className="size-[18px]" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
