/**
 * Drag handle between the request and response panes (md and up).
 * Drag with the mouse/touch, or focus it and use ↑/↓. Double-click resets.
 */
const MIN = 15; // %
const MAX = 80; // %
const DEFAULT = 45; // %
const STEP = 5; // % per arrow key press

export function initPaneResizer(): void {
  const split = document.querySelector<HTMLElement>("#split");
  const reqPane = document.querySelector<HTMLElement>("#req-pane");
  const handle = document.querySelector<HTMLElement>("#resizer");
  if (!split || !reqPane || !handle) return;

  let current = DEFAULT;
  const apply = (percent: number): void => {
    current = Math.min(MAX, Math.max(MIN, percent));
    reqPane.style.flexBasis = `${current}%`;
    handle.setAttribute("aria-valuenow", String(Math.round(current)));
  };

  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId); // keep receiving moves even off the handle
    handle.dataset.dragging = "true";
    document.body.style.cursor = "row-resize";
  });

  handle.addEventListener("pointermove", (event) => {
    if (handle.dataset.dragging !== "true") return;
    const rect = split.getBoundingClientRect();
    apply(((event.clientY - rect.top) / rect.height) * 100);
  });

  const stop = (): void => {
    handle.dataset.dragging = "false";
    document.body.style.cursor = "";
  };
  handle.addEventListener("pointerup", stop);
  handle.addEventListener("pointercancel", stop);

  handle.addEventListener("dblclick", () => apply(DEFAULT));

  handle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") apply(current - STEP);
    else if (event.key === "ArrowDown") apply(current + STEP);
    else return;
    event.preventDefault();
  });

  handle.setAttribute("aria-valuemin", String(MIN));
  handle.setAttribute("aria-valuemax", String(MAX));
  apply(DEFAULT);
}
