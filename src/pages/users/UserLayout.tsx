import { Link, NavLink, Outlet, useOutletContext, useParams } from "react-router";
import { initials } from "../../auth/AuthContext";
import { getUser } from "../../backend/admin";
import { BackendError } from "../../backend/client";
import type { UserDetail } from "../../backend/users";
import { useAsync } from "../../hooks/useAsync";
import { errorMessage } from "../../lib/format";
import { roleLabel, UserStatusBadge } from "./userDisplay";

/** What the tabs get from this layout. */
type UserContext = { user: UserDetail };

/** For the tabs: the user this page is about. */
export const useViewedUser = (): UserDetail => useOutletContext<UserContext>().user;

/** A user's page for admins: header + Details/Sessions tabs (each its own route). */
export function UserLayout() {
  const { userId = "" } = useParams();
  const { data: user, error, loading } = useAsync(() => getUser(userId), [userId]);

  const tabs = [
    { to: `/users/${userId}`, label: "Details", end: true },
    { to: `/users/${userId}/sessions`, label: "Sessions", end: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
        <Link to="/users" className="inline-block text-xs text-fg-subtle hover:text-fg">
          ‹ All users
        </Link>

        {loading && !user ? (
          <p className="text-fg-subtle">Loading user…</p>
        ) : error instanceof BackendError && error.status === 404 ? (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface p-10 text-center">
            <p className="font-medium">User not found</p>
            <p className="text-fg-subtle">It may have been removed, or the link is wrong.</p>
          </div>
        ) : error || !user ? (
          <p role="alert" className="text-xs text-err">
            {errorMessage(error)}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-full bg-put text-lg font-semibold text-white">
                {initials(user.display_name)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="truncate">{user.display_name}</span>
                  <UserStatusBadge status={user.status} />
                </h1>
                <p className="truncate text-fg-subtle">
                  {user.email} · {roleLabel(user.system_role)}
                  {user.job_title && ` · ${user.job_title}`}
                </p>
              </div>
            </div>

            <nav aria-label="User" className="flex gap-1 border-b border-line">
              {tabs.map(({ to, label, end }) => (
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

            <Outlet context={{ user } satisfies UserContext} />
          </>
        )}
      </div>
    </div>
  );
}
