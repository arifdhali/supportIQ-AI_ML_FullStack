import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, useUser } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errMsg } from "@/utils/error";
import { initials } from "@/utils/format";
import type { Preferences, User } from "@/types";

const PREFS: Array<[string, string]> = [
  ["newAssignment", "Notify me of new assignments"],
  ["customerReply", "Notify me when a customer replies"],
  ["highPriority", "Alert me about high-priority tickets"],
];
interface TabProps { user: User; updateUser: (u: User) => void }

function Profile({ user, updateUser }: TabProps) {
  const [f, setF] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [busy, setBusy] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (f.name.trim().length < 2) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email.";
    setErrors(er);
    if (Object.keys(er).length || busy) return;
    setBusy(true);
    try { updateUser(await authService.updateProfile(user.id, { name: f.name.trim(), email: f.email })); toast.success("Profile updated"); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={(e) => void save(e)} noValidate className="max-w-md">
      <FieldGroup>
        <div className="flex items-center gap-3"><Avatar className="size-14"><AvatarFallback className="text-base">{initials(user.name)}</AvatarFallback></Avatar><span className="text-sm text-muted-foreground">Avatar uses your initials.</span></div>
        <Field data-invalid={!!errors.name}><FieldLabel htmlFor="p-name">Full name</FieldLabel><Input id="p-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!errors.name} />{errors.name && <FieldError>{errors.name}</FieldError>}</Field>
        <Field data-invalid={!!errors.email}><FieldLabel htmlFor="p-email">Email</FieldLabel><Input id="p-email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!errors.email} />{errors.email && <FieldError>{errors.email}</FieldError>}</Field>
        <Button disabled={busy} className="w-fit">{busy && <Spinner />}Update profile</Button>
      </FieldGroup>
    </form>
  );
}

function Security({ user, logout }: { user: User; logout: () => Promise<void> }) {
  const nav = useNavigate();
  const [f, setF] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f, string>>>({});
  const [busy, setBusy] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!f.current) er.current = "Enter your current password.";
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(f.next)) er.next = "At least 8 characters, with a letter and a number.";
    if (f.confirm !== f.next) er.confirm = "Passwords do not match.";
    setErrors(er);
    if (Object.keys(er).length || busy) return;
    setBusy(true);
    try { await authService.changePassword(user.id, { current: f.current, next: f.next }); toast.success("Password changed"); setF({ current: "", next: "", confirm: "" }); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };
  const field = (k: keyof typeof f, label: string) => (
    <Field data-invalid={!!errors[k]}>
      <FieldLabel htmlFor={`s-${k}`}>{label}</FieldLabel>
      <Input id={`s-${k}`} type="password" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errors[k]} />
      {errors[k] && <FieldError>{errors[k]}</FieldError>}
    </Field>
  );
  return (
    <div className="max-w-md space-y-6">
      <form onSubmit={(e) => void save(e)} noValidate>
        <FieldGroup>
          {field("current", "Current password")}{field("next", "New password")}{field("confirm", "Confirm new password")}
          <Button disabled={busy} className="w-fit">{busy && <Spinner />}Change password</Button>
        </FieldGroup>
      </form>
      <Button variant="outline" onClick={() => void logout().then(() => nav("/login"))}>Log out</Button>
    </div>
  );
}

function PreferencesTab({ user, updateUser }: TabProps) {
  const [p, setP] = useState<Preferences>(() => Object.fromEntries(PREFS.map(([k]) => [k, user.preferences[k] ?? true])));
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { updateUser(await authService.savePreferences(user.id, p)); toast.success("Preferences saved"); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };
  return (
    <FieldGroup className="max-w-md">
      {PREFS.map(([k, l]) => (
        <Field key={k} orientation="horizontal">
          <Checkbox id={`pref-${k}`} checked={p[k]} onCheckedChange={(c) => setP({ ...p, [k]: c === true })} />
          <FieldLabel htmlFor={`pref-${k}`} className="font-normal">{l}</FieldLabel>
        </Field>
      ))}
      <Button onClick={() => void save()} disabled={busy} className="w-fit">{busy && <Spinner />}Save preferences</Button>
    </FieldGroup>
  );
}

function Work({ user, updateUser }: TabProps) {
  const [busy, setBusy] = useState(false);
  const available = user.preferences.available ?? true;
  const toggle = async () => {
    setBusy(true);
    try { updateUser(await authService.savePreferences(user.id, { available: !available })); toast.success("Availability updated"); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };
  return (
    <FieldGroup className="max-w-md">
      <div className="text-sm"><span className="text-muted-foreground">Department: </span>{user.department?.name}</div>
      <div className="text-sm"><span className="text-muted-foreground">Role: </span>Support Agent</div>
      <FieldDescription>Role and department are managed by your organization and cannot be changed here.</FieldDescription>
      <Button variant="outline" className="w-fit" onClick={() => void toggle()} disabled={busy}>{busy && <Spinner />}{available ? "Available · set Away" : "Away · set Available"}</Button>
    </FieldGroup>
  );
}

export default function SettingsPage() {
  const user = useUser();
  const { updateUser, logout } = useAuth();
  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger><TabsTrigger value="work">Work</TabsTrigger>
        </TabsList>
        <Card className="p-6">
          <TabsContent value="profile"><Profile user={user} updateUser={updateUser} /></TabsContent>
          <TabsContent value="security"><Security user={user} logout={logout} /></TabsContent>
          <TabsContent value="preferences"><PreferencesTab user={user} updateUser={updateUser} /></TabsContent>
          <TabsContent value="work"><Work user={user} updateUser={updateUser} /></TabsContent>
        </Card>
      </Tabs>
    </>
  );
}
