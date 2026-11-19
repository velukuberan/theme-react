/**
 * Sidebar drawer. Below the `lg` breakpoint the sidebar slides in over the page;
 * from `lg` up it is a normal column and this code stays out of the way.
 */
const desktop = window.matchMedia("(min-width: 64rem)"); // Tailwind's lg breakpoint

export function initSidebarDrawer(): void {
  const sidebar = document.querySelector<HTMLElement>("#sidebar");
  const backdrop = document.querySelector<HTMLElement>("[data-sidebar-backdrop]");
  const toggle = document.querySelector<HTMLButtonElement>('[data-action="toggle-sidebar"]');
  if (!sidebar || !backdrop || !toggle) return;

  const setOpen = (open: boolean): void => {
    sidebar.dataset.open = String(open);
    backdrop.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close sidebar" : "Open sidebar");
  };
  const isOpen = (): boolean => sidebar.dataset.open === "true";

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  backdrop.addEventListener("click", () => setOpen(false));
  document.querySelector('[data-action="close-sidebar"]')?.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setOpen(false);
  });

  // On phones/tablets, picking a request closes the drawer.
  sidebar.addEventListener("click", (event) => {
    if (!desktop.matches && (event.target as Element).closest("#tree a")) setOpen(false);
  });

  // Growing the window to desktop width resets the drawer state.
  desktop.addEventListener("change", () => setOpen(false));
}
