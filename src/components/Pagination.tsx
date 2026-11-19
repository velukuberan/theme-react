type Props = {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

/** Page numbers to show: always first and last, the current page and its neighbours, "…" for gaps. */
function pageItems(page: number, pages: number): (number | "…")[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...keep].sort((a, b) => a - b);
  const items: (number | "…")[] = [];
  for (const [i, p] of sorted.entries()) {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("…");
    items.push(p);
  }
  return items;
}

const BUTTON =
  "grid h-7 min-w-7 place-items-center rounded-md px-2 text-fg-muted hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40 aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent";

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <p className="text-fg-subtle">
        Showing {first}–{last} of {total}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <button type="button" className={BUTTON} disabled={page <= 1} onClick={() => onChange(page - 1)}>
            ‹ Prev
          </button>
          {pageItems(page, pages).map((item, i) =>
            item === "…" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: separators have no identity of their own
              <span key={`gap-${i}`} className="px-1 text-fg-subtle">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={BUTTON}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            ),
          )}
          <button type="button" className={BUTTON} disabled={page >= pages} onClick={() => onChange(page + 1)}>
            Next ›
          </button>
        </div>
      )}
    </nav>
  );
}
