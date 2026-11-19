import { ChevronDownIcon, FilterIcon } from "../icons";
import { MethodBadge, type HttpMethod } from "../MethodBadge";
import { SECTIONS, type View } from "./IconRail";

const ITEMS: { method: HttpMethod; name: string; active?: boolean }[] = [
  { method: "GET", name: "List users" },
  { method: "POST", name: "Create user", active: true },
  { method: "DELETE", name: "Deactivate user" },
];

const TITLES: Record<View, string> = {
  apis: "Collections",
  env: "Environments",
  history: "History",
};

type Props = {
  view: View | null; // null = collapsed
  onChangeView: (view: View) => void;
  onClose: () => void;
};

export function Sidebar({ view, onChangeView, onClose }: Props) {
  const open = view !== null;
  const title = view ? TITLES[view] : "";

  return (
    <>
      {/* Backdrop: only below lg, only while open */}
      <div
        data-open={open}
        onClick={onClose}
        className="fixed inset-0 z-30 hidden bg-black/40 max-lg:data-[open=true]:block"
      />

      <aside
        id="sidebar"
        data-open={open}
        aria-label={title || "Sidebar"}
        className="fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-line bg-surface shadow-xl transition-transform duration-200 data-[open=true]:translate-x-0 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none lg:data-[open=false]:hidden"
      >
        {/* Section tabs: mobile only, since the icon rail is hidden below md */}
        <div
        role="tablist"
        aria-label="Sections"
        className="mx-3 mt-3 mb-1 grid grid-cols-3 gap-1.5 rounded-lg bg-surface-2 p-1.5 md:hidden"
        >
        {SECTIONS.map(({ id, label, Icon }) => (
            <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            onClick={() => onChangeView(id)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-line/60 py-1.5 text-xs text-fg-subtle hover:bg-surface hover:text-fg aria-selected:border-transparent aria-selected:bg-surface aria-selected:text-accent aria-selected:shadow-sm"
            >
            <Icon className="size-4" />
            {label}
            </button>
        ))}
        </div>

        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <h2 className="flex-1 font-semibold">{title}</h2>
          {view === "apis" && (
            <button type="button" className="rounded-md border border-line-strong bg-surface-3 px-2.5 py-0.5 hover:border-accent">
              + New
            </button>
          )}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg lg:hidden"
          >
            ✕
          </button>
        </div>

        {view === "apis" && (
          <>
            <label className="mx-3 mb-2 flex items-center gap-2 rounded-md border border-line bg-surface-2 px-2 py-1 text-fg-subtle">
              <FilterIcon className="size-3" />
              <input placeholder="Filter" className="min-w-0 flex-1 bg-transparent text-xs text-fg outline-none" />
            </label>

            <nav aria-label="Requests" className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
              <div className="flex items-center gap-1.5 px-2 py-1 font-medium text-fg-muted">
                <ChevronDownIcon className="size-3.5 shrink-0" />
                User Management
              </div>
              {ITEMS.map(({ method, name, active }) => (
                <a
                  key={name}
                  href="#"
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-2 rounded-md py-1 pr-2 pl-5 text-fg-muted hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-surface-3 aria-[current=page]:text-fg"
                >
                  <MethodBadge method={method} className="w-10 text-right" />
                  {name}
                </a>
              ))}
            </nav>
          </>
        )}

        {view !== null && view !== "apis" && (
          <p className="px-3 py-2 text-xs text-fg-subtle">{title}: coming soon.</p>
        )}

        {/* Items the top bar hides on small screens */}
        <div className="mt-auto space-y-2 border-t border-line p-3 md:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-fg-muted hover:bg-surface-2 hover:text-fg"
          >
            Restling Workspace
            <ChevronDownIcon className="size-3" />
          </button>

          <select
            aria-label="Environment"
            defaultValue="local"
            className="w-full rounded-md border border-line bg-surface-2 px-2 py-1.5 text-fg outline-none focus:border-accent sm:hidden"
          >
            <option value="local">Local</option>
            <option value="staging">Staging</option>
            <option value="none">No environment</option>
          </select>
        </div>
      </aside>
    </>
  );
}
