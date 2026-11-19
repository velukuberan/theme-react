import { type InputHTMLAttributes, useId } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

/** Label + input + optional error message, styled with the theme tokens. */
export function Field({ label, error, className = "", ...input }: Props) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-xs font-medium text-fg-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-md border border-line bg-surface-2 px-2.5 py-1.5 text-fg outline-none placeholder:text-fg-subtle focus:border-accent aria-invalid:border-err"
        {...input}
      />
      {error && (
        <p id={errorId} className="text-xs text-err">
          {error}
        </p>
      )}
    </div>
  );
}
