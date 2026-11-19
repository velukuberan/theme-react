import { NavLink, Outlet } from "react-router";
import { initials, useAuth } from "../../auth/AuthContext";

const TABS = [
  { to: "/profile", label: "Account", end: true },
  { to: "/profile/sessions", label: "Sessions", end: false },
];

/** Profile header + Account/Sessions tabs. Each tab is its own route, so back/reload/links work. */
export function ProfileLayout() {
  const { user } = useAuth();
  if (!user) return null; // RequireAuth makes this unreachable; keeps TypeScript happy

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-put text-lg font-semibold text-white">
            {initials(user.display_name)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{user.display_name}</h1>
            <p className="truncate text-fg-subtle">
              {user.email} · {user.system_role}
              {user.job_title && ` · ${user.job_title}`}
            </p>
          </div>
        </div>

        <nav aria-label="Profile" className="flex gap-1 border-b border-line">
          {TABS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="-mb-px border-b-2 border-transparent px-3 py-2 text-fg-muted hover:text-fg aria-[current=page]:border-accent aria-[current=page]:text-fg"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
