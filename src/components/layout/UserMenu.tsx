import { useEffect, useId, useRef, useState } from "react";
import { LogOutIcon, UserIcon } from "../icons";

/**
 * Avatar button with a small dropdown for account actions.
 * Closes on outside click, on Esc (focus returns to the avatar) and after an item is picked.
 */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Placeholders until there's a profile page and auth: picking an item just closes the menu.
  const pick = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="grid size-7 cursor-pointer place-items-center rounded-full bg-put text-xs font-semibold text-white hover:ring-2 hover:ring-line-strong aria-expanded:ring-2 aria-expanded:ring-accent"
      >
        VK
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute top-full right-0 z-50 mt-2 w-44 rounded-lg border border-line bg-surface p-1 shadow-xl"
        >
          <button
            type="button"
            onClick={pick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-fg-muted hover:bg-surface-2 hover:text-fg"
          >
            <UserIcon className="size-4" />
            Profile
          </button>

          <div className="my-1 border-t border-line" />

          <button
            type="button"
            onClick={pick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-fg-muted hover:bg-surface-2 hover:text-delete"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
