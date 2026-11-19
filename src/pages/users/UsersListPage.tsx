import { Link, useSearchParams } from "react-router";
import { listUsers, type UserStatus } from "../../backend/admin";
import { UserPlusIcon } from "../../components/icons";
import { Pagination } from "../../components/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { errorMessage, formatDate, formatDateTime } from "../../lib/format";

const PAGE_SIZE = 25;

const STATUS_STYLE: Record<UserStatus, string> = {
  active: "bg-ok/12 text-ok",
  pending: "bg-warn/12 text-warn",
  suspended: "bg-err/12 text-err",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[status] ?? "bg-surface-3 text-fg-subtle"}`}
    >
      {status}
    </span>
  );
}

/** "administrator" → "Administrator" */
const roleLabel = (role: string): string => role.charAt(0).toUpperCase() + role.slice(1);

/** All users, newest first, 25 per page. The page lives in the URL (?page=2). */
export function UsersListPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);

  const { data, error, loading } = useAsync(
    () => listUsers({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    [page],
  );
  const users = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const goTo = (next: number) => setParams(next > 1 ? { page: String(next) } : {});

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold">All users</h1>
            <p className="text-fg-subtle">{data ? `${total} ${total === 1 ? "user" : "users"}` : "\u00a0"}</p>
          </div>
          <Link
            to="/users/new"
            className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 font-semibold text-on-accent hover:bg-accent-hover"
          >
            <UserPlusIcon className="size-4" />
            Add new user
          </Link>
        </div>

        {error ? (
          <p role="alert" className="text-xs text-err">
            {errorMessage(error)}
          </p>
        ) : null}

        <div
          className={`space-y-4 rounded-xl border border-line bg-surface p-4 transition-opacity sm:p-5 ${loading && data ? "opacity-60" : ""}`}
        >
          {loading && !data ? (
            <p className="text-fg-subtle">Loading users…</p>
          ) : users.length === 0 ? (
            <p className="text-fg-subtle">No users found.</p>
          ) : (
            <>
              {/* Table from md up */}
              <table className="hidden w-full text-left md:table">
                <thead className="text-xs text-fg-subtle">
                  <tr className="border-b border-line">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Role</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2 pr-3">
                        <div className="font-medium">{u.display_name}</div>
                        {u.job_title && <div className="text-xs text-fg-subtle">{u.job_title}</div>}
                      </td>
                      <td className="py-2 pr-3 text-fg-muted">{u.email}</td>
                      <td className="py-2 pr-3 text-fg-muted">{roleLabel(u.system_role)}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="py-2 text-fg-muted">
                        <time dateTime={u.created_at} title={formatDateTime(u.created_at)}>
                          {formatDate(u.created_at)}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cards below md */}
              <ul className="space-y-2 md:hidden">
                {users.map((u) => (
                  <li key={u.id} className="rounded-lg border border-line px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{u.display_name}</span>
                      <StatusBadge status={u.status} />
                    </div>
                    <p className="truncate text-xs text-fg-subtle">
                      {u.email} · {roleLabel(u.system_role)} · {formatDate(u.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {data && total > 0 && <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={goTo} />}
        </div>
      </div>
    </div>
  );
}
