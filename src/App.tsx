import { IconRail } from "./components/layout/IconRail";
import { Sidebar } from "./components/layout/Sidebar";
import { StatusBar } from "./components/layout/StatusBar";
import { TopBar } from "./components/layout/TopBar";

export function App() {
  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
      <TopBar />

      <div className="relative flex min-h-0">
        <IconRail />
        <Sidebar />

        {/* Workbench components come in Step R4 */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="grid flex-1 place-items-center p-6 text-center text-fg-subtle">
            Workbench goes here (Step R4)
          </div>
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
