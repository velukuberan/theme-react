import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import { IconRail, type View } from "./components/layout/IconRail";
import { Sidebar } from "./components/layout/Sidebar";
import { StatusBar } from "./components/layout/StatusBar";
import { TopBar } from "./components/layout/TopBar";

export function App() {
  const [view, setView] = useState<View | null>(() =>
    window.matchMedia("(min-width: 1024px)").matches ? "apis" : null,
  );

  // Remember the last open section so the hamburger reopens it
  const lastView = useRef<View>("apis");
  useEffect(() => {
    if (view) lastView.current = view;
  }, [view]);

  const toggleView = (v: View) => setView((cur) => (cur === v ? null : v));
  const toggleMenu = () => setView((cur) => (cur ? null : lastView.current));

  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
      <TopBar onMenuClick={toggleMenu} />

      <div className="relative flex min-h-0">
        <IconRail active={view} onSelect={toggleView} />
        <Sidebar view={view} onChangeView={setView} onClose={() => setView(null)} />
        <main className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
