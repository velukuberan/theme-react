import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/forms/Button";
import { Field } from "../components/forms/Field";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  // Where RequireAuth sent us from, so we can go back there after signing in.
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    signIn(email, password);
    navigate(from, { replace: true });
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
        <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
        {error && <p className="text-xs text-err">{error}</p>}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
