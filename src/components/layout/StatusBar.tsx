export function StatusBar() {
  return (
    <footer className="flex h-7 items-center gap-4 border-t border-line bg-surface px-3 text-[11.5px] text-fg-subtle">
      <span className="flex items-center gap-1.5">
        <span className="size-[7px] rounded-full bg-ok" />
        Ready
      </span>
      <span className="hidden truncate sm:inline">base_url → http://localhost:8000/api/v1</span>
      <span className="ml-auto hidden gap-4 sm:flex">
        <button type="button" className="hover:text-fg">Console</button>
        <button type="button" className="hover:text-fg">Cookies</button>
      </span>
      <span>v0.1</span>
    </footer>
  );
}
