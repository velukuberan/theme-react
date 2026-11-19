import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const VARIANTS = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-line-strong bg-surface-3 text-fg hover:border-accent",
} as const;

export function Button({ variant = "primary", className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`rounded-md px-3.5 py-1.5 font-semibold disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
