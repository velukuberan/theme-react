import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Shared defaults for the outline icons: 24×24 grid, drawn with the current text colour. */
function Icon({ children, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;
export const ChevronDownIcon = (p: IconProps) => <Icon strokeWidth={2.5} {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const SearchIcon = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>;
export const MonitorIcon = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></Icon>;
export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);
export const MoonIcon = (p: IconProps) => <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>;
export const FolderIcon = (p: IconProps) => <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Icon>;
export const EnvIcon = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h6" /></Icon>;
export const HistoryIcon = (p: IconProps) => <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></Icon>;
export const FilterIcon = (p: IconProps) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4" /></Icon>;
export const CloseIcon = (p: IconProps) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
export const ArrowRightIcon = (p: IconProps) => <Icon strokeWidth={3} {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>;
