import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ticketsService } from "@/services/tickets.service";
import { CATEGORIES, ROUTING_POLICY } from "@/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/utils/error";

type Errors = Partial<Record<"name" | "email" | "category" | "subject" | "message" | "form", string>>;
const EMPTY = { name: "", email: "", category: "", subject: "", message: "", website: "" };

export default function ContactForm() {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ reference: string; email: string } | null>(null);
  const category = CATEGORIES.find((c) => c === f.category);
  const text = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: Errors = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!category) er.category = "Choose what your message is about.";
    if (f.subject.trim().length < 5) er.subject = "Subject must be at least 5 characters.";
    if (f.message.trim().length < 20) er.message = "Please tell us a little more (at least 20 characters).";
    setErrors(er);
    if (Object.keys(er).length || !category) return;
    setBusy(true);
    try {
      const r = await ticketsService.createPublic({ name: f.name.trim(), email: f.email.trim(), category, subject: f.subject.trim(), message: f.message.trim(), website: f.website });
      setDone({ reference: r.reference, email: f.email.trim() });
      setF(EMPTY);
    } catch (err) { setErrors({ form: errMsg(err, "We could not send your message. Please try again.") }); }
    finally { setBusy(false); }
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <Card className="items-center gap-3 p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}><CheckCircle2 className="size-12 text-green-600" /></motion.div>
            <h2 className="text-xl font-semibold">Message sent</h2>
            <p className="text-sm text-muted-foreground">Your reference number is <span className="font-mono font-semibold text-foreground">{done.reference}</span>. Our team will reply to {done.email}.</p>
            <Button variant="outline" onClick={() => setDone(null)}>Send another message</Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Card className="p-6">
            <form onSubmit={(e) => void submit(e)} noValidate>
              <FieldGroup>
                {errors.form && <Alert variant="destructive"><AlertDescription>{errors.form}</AlertDescription></Alert>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="c-name">Full name</FieldLabel>
                    <Input id="c-name" autoComplete="name" value={f.name} onChange={text("name")} aria-invalid={!!errors.name} />
                    {errors.name && <FieldError>{errors.name}</FieldError>}
                  </Field>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="c-email">Email address</FieldLabel>
                    <Input id="c-email" type="email" autoComplete="email" value={f.email} onChange={text("email")} aria-invalid={!!errors.email} />
                    {errors.email && <FieldError>{errors.email}</FieldError>}
                  </Field>
                </div>
                <Field data-invalid={!!errors.category}>
                  <FieldLabel htmlFor="c-category">What is this about?</FieldLabel>
                  <NativeSelect id="c-category" className="w-full" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} aria-invalid={!!errors.category}>
                    <NativeSelectOption value="" disabled>Select a topic</NativeSelectOption>
                    {CATEGORIES.map((c) => <NativeSelectOption key={c} value={c}>{c}</NativeSelectOption>)}
                  </NativeSelect>
                  {category && !errors.category && <FieldDescription>Your message will go to: {ROUTING_POLICY[category]}</FieldDescription>}
                  {errors.category && <FieldError>{errors.category}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.subject}>
                  <FieldLabel htmlFor="c-subject">Subject</FieldLabel>
                  <Input id="c-subject" value={f.subject} onChange={text("subject")} aria-invalid={!!errors.subject} />
                  {errors.subject && <FieldError>{errors.subject}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.message}>
                  <FieldLabel htmlFor="c-message">Message</FieldLabel>
                  <Textarea id="c-message" rows={6} value={f.message} onChange={text("message")} aria-invalid={!!errors.message} />
                  {errors.message && <FieldError>{errors.message}</FieldError>}
                </Field>
                {/* Honeypot: hidden from people, filled by bots */}
                <div aria-hidden className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={text("website")} /></label></div>
                <Button disabled={busy} className="w-full">{busy && <Spinner />}{busy ? "Sending…" : "Send message"}</Button>
              </FieldGroup>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
