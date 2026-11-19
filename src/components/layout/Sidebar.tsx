import { FilterIcon } from "../icons";
import { MethodBadge, type HttpMethod } from "../MethodBadge";

/** Static placeholder items: this is UI only, so the list is just display content. */
const ITEMS: { method: HttpMethod; name: string; active?: boolean }[] = [
  { method: "GET", name: "List users" },
  { method: "POST", name: "Create user", active: true },
  { method: "DELETE", name: "Deactivate user" },
];

export function Sidebar() {
  return (
    <>
      {/* Backdrop: only visible while the drawer is open below lg (wired up in Step R3) */}
      <div data-open="false" className="fixed inset-0 z-30 hidden bg-black/40 data-[open=true]:block lg:hidden" />

      {/* A slide-in drawer below lg, a normal column from lg up */}
      <aside
        id="sidebar"
        data-open="false"
        aria-label="Collections"
        className="fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-line bg-surface shadow-xl transition-transform duration-200 data-[open=true]:translate-x-0 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <h2 className="flex-1 font-semibold">Collections</h2>
          <button type="button" className="rounded-md border border-line-strong bg-surface-3 px-2.5 py-0.5 hover:border-accent">
            + New
          </button>
          <button
            type="button"
            aria-label="Close sidebar"
            className="grid size-7 place-items-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg lg:hidden"
          >
            ✕
          </button>
        </div>

        <label className="mx-3 mb-2 flex items-center gap-2 rounded-md border border-line bg-surface-2 px-2 py-1 text-fg-subtle">
          <FilterIcon className="size-3" />
          <input placeholder="Filter" className="min-w-0 flex-1 bg-transparent text-xs text-fg outline-none" />
        </label>

        <nav aria-label="Requests" className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          <div className="px-2 py-1 font-medium text-fg-muted">▾ User Management</div>
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
      </aside>
    </>
  );
}
