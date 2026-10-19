import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AGENT_HOME } from "@/constants";
import AuthLayout from "@/components/layout/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { errMsg } from "@/utils/error";

type Errors = Partial<Record<"email" | "password", string>>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState<Errors>({});
  const [authError, setAuthError] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email address.";
    if (!form.password) er.password = "Password is required.";
    setErrors(er); setAuthError("");
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.name}`);
      navigate(AGENT_HOME, { replace: true });
    } catch (err) { setAuthError(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <AuthLayout title="Staff sign in" subtitle="Sign in to manage and resolve support tickets.">
      <form onSubmit={(e) => void submit(e)} noValidate>
        <FieldGroup>
          {authError && <Alert variant="destructive"><AlertDescription>{authError}</AlertDescription></Alert>}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input id="password" className="pr-10" type={show ? "text" : "password"} autoComplete="current-password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} />
              <button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility" className="absolute top-2.5 right-3 text-muted-foreground">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>
          <div className="flex items-center justify-between text-sm">
            <Field orientation="horizontal" className="w-auto">
              <Checkbox id="remember" checked={form.remember} onCheckedChange={(c) => setForm({ ...form, remember: c === true })} />
              <FieldLabel htmlFor="remember" className="font-normal">Remember me</FieldLabel>
            </Field>
            <button type="button" className="text-primary" onClick={() => toast("Password reset arrives with the backend.")}>Forgot password?</button>
          </div>
          <Button disabled={busy} className="w-full">{busy && <Spinner />}{busy ? "Signing in…" : "Sign in"}</Button>
          <p className="text-center text-sm text-muted-foreground"><Link to="/" className="text-primary">← Back to website</Link></p>
          {import.meta.env.VITE_USE_MOCK === "true" && (
            <p className="rounded-lg bg-muted p-2 text-xs text-muted-foreground">Mock staff logins: agent@supportiq.dev / Agent@1234 · meera@supportiq.dev / Agent@1234</p>
          )}
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
