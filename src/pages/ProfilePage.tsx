import { type FormEvent, type ReactNode, useState } from "react";
import { initials, useAuth } from "../auth/AuthContext";
import { Button } from "../components/forms/Button";
import { Field } from "../components/forms/Field";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="border-b border-line px-5 py-3">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-fg-subtle">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!user) return null; // RequireAuth makes this unreachable; keeps TypeScript happy

  const onSaveDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateProfile({
      display_name: String(form.get("display_name")).trim() || user.display_name,
      job_title: String(form.get("job_title")).trim() || null,
    });
    setSaved("Details saved.");
  };

  // Fake: only checks that the two new passwords match.
  const onChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    if (String(form.get("new")) !== String(form.get("confirm"))) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setPasswordError("");
    formEl.reset();
    setSaved("Password changed.");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
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

        {saved && (
          <p role="status" className="rounded-md border border-ok/40 bg-ok/10 px-3 py-2 text-ok">
            {saved}
          </p>
        )}

        <Section
          title="Personal details"
          description="Your display name and job title. Email can only be changed by an administrator."
        >
          {/* key: reset the inputs when the saved user changes */}
          <form key={`${user.display_name}|${user.job_title}`} onSubmit={onSaveDetails} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Display name" name="display_name" defaultValue={user.display_name} autoComplete="name" />
              <Field label="Job title" name="job_title" defaultValue={user.job_title ?? ""} />
              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={user.email}
                readOnly
                className="sm:col-span-2"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Section>

        <Section title="Change password" description="Use at least 8 characters.">
          <form onSubmit={onChangePassword} className="space-y-4">
            <Field label="Current password" name="current" type="password" autoComplete="current-password" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password" name="new" type="password" autoComplete="new-password" minLength={8} />
              <Field
                label="Confirm new password"
                name="confirm"
                type="password"
                autoComplete="new-password"
                error={passwordError}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary">
                Update password
              </Button>
            </div>
          </form>
        </Section>
      </div>
    </div>
  );
}
