import type { ComponentType, SVGProps } from "react";
import { type Theme, useTheme } from "../hooks/useTheme";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

const OPTIONS: { value: Theme; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { value: "system", label: "System theme", Icon: MonitorIcon },
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolved } = useTheme();

  return (
    <fieldset className="flex gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5">
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          title={value === "system" ? `System theme (currently ${resolved})` : label}
          onClick={() => setTheme(value)}
          className="grid h-6 w-7 place-items-center rounded-md text-fg-subtle hover:text-fg aria-pressed:bg-canvas aria-pressed:text-accent"
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </fieldset>
  );
}
