import { type FormEvent, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/forms/Button";
import { Field } from "../../components/forms/Field";
import { Section } from "../../components/Section";

export function AccountTab() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!user) return null;

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
    <div className="space-y-5">
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
  );
}
