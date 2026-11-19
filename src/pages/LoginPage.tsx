import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { BackendError } from "../backend/client";
import { Button } from "../components/forms/Button";
import { Field } from "../components/forms/Field";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // On success GuestOnly redirects (back to where RequireAuth sent us from).
      await signIn(email, password);
    } catch (err) {
      // The server's own message, e.g. "Invalid email address or password."
      setError(err instanceof BackendError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to API Console"
      subtitle="Welcome back"
      footer={
        <>
          No account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />
        {error && (
          <p role="alert" className="text-xs text-err">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
