import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router";
import { type Permission, useCan } from "../../auth/permissions";
import { EnvIcon, FolderIcon, HelpIcon, HistoryIcon, SettingsIcon, UsersIcon } from "../icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Sidebar panels: things you browse while you work. */
export type View = "apis" | "env" | "history";

export const SECTIONS: { id: View; label: string; Icon: IconComponent }[] = [
  { id: "apis", label: "APIs", Icon: FolderIcon },
  { id: "env", label: "Env", Icon: EnvIcon },
  { id: "history", label: "History", Icon: HistoryIcon },
];

export type PageLink = {
  to: string;
  label: string;
  Icon: IconComponent;
  /** "top": under the sidebar sections. "bottom": pinned to the bottom (Settings last, by convention). */
  placement: "top" | "bottom";
  /** Hidden from users without this permission. Left out = everyone. */
  requires?: Permission;
};

/** Full pages. Every menu (rail, mobile drawer) is built from this one list, filtered by permission. */
export const PAGE_LINKS: PageLink[] = [
  { to: "/users", label: "Users", Icon: UsersIcon, placement: "top", requires: "users.manage" },
  { to: "/help", label: "Help", Icon: HelpIcon, placement: "bottom" },
  { to: "/settings", label: "Settings", Icon: SettingsIcon, placement: "bottom" },
];

/** The page links this user may see. */
export function useVisiblePageLinks(): PageLink[] {
  const can = useCan();
  return PAGE_LINKS.filter((link) => !link.requires || can(link.requires));
}

const ITEM_CLASS =
  "flex w-12 cursor-pointer flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] text-fg-subtle hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent";

type Props = {
  active: View | null;
  onSelect: (view: View) => void;
};

export function IconRail({ active, onSelect }: Props) {
  const links = useVisiblePageLinks();
  const top = links.filter((link) => link.placement === "top");
  const bottom = links.filter((link) => link.placement === "bottom");

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

      {top.length > 0 && (
        <>
          <div className="my-1 h-px w-8 bg-line" />
          {top.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={ITEM_CLASS}>
              <Icon className="size-[18px]" />
              {label}
            </NavLink>
          ))}
        </>
      )}

      {/* mt-auto pushes these to the bottom. NavLink sets aria-current="page" on the active route. */}
      <div className="mt-auto flex flex-col items-center gap-1">
        {bottom.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={ITEM_CLASS}>
            <Icon className="size-[18px]" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
