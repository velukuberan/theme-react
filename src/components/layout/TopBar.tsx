import { ThemeSwitcher } from "../ThemeSwitcher";
import { ChevronDownIcon, MenuIcon, SearchIcon } from "../icons";

type Props = { onMenuClick: () => void };

export function TopBar({ onMenuClick }: Props) {
  return (
    <header className="flex h-11 items-center gap-2 border-b border-line bg-surface px-2 sm:gap-3 sm:px-3">
      {/* Menu button: only below lg, opens the sidebar drawer (wired up in Step R3) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-controls="sidebar"
        aria-label="Open sidebar"
        className="grid size-8 place-items-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg lg:hidden"
      >
        <MenuIcon className="size-[18px]" />
      </button>

      <div className="flex items-center gap-2 font-semibold">
        <span className="grid size-[22px] place-items-center rounded-md bg-accent font-mono text-xs text-on-accent">{"{ }"}</span>
        <span className="hidden sm:inline">API Console</span>
      </div>

      <button
        type="button"
        className="hidden items-center gap-1 rounded-md px-2.5 py-1 text-fg-muted hover:bg-surface-2 hover:text-fg md:flex"
      >
        Restling Workspace
        <ChevronDownIcon className="size-3" />
      </button>

      <label className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-fg-subtle focus-within:border-accent lg:flex">
        <SearchIcon className="size-3.5" />
        <input
          placeholder="Search requests"
          className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
        />
        <kbd className="rounded border border-line-strong px-1.5 font-mono text-[11px]">Ctrl K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <ThemeSwitcher />

        <select
          aria-label="Environment"
          defaultValue="local"
          className="hidden rounded-md border border-line bg-surface-2 px-2 py-1 text-fg outline-none focus:border-accent sm:block"
        >
          <option value="local">Local</option>
          <option value="staging">Staging</option>
          <option value="none">No environment</option>
        </select>

        <div className="grid size-7 place-items-center rounded-full bg-put text-xs font-semibold text-white">VK</div>
      </div>
    </header>
  );
}
