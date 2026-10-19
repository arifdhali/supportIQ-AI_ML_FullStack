import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { errMsg } from "@/utils/error";

export default function ReplyComposer({ onSend }: { onSend: (p: { body: string; internal: boolean }) => Promise<void> }) {
  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const internal = mode === "note";

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !body.trim()) return;
    setBusy(true);
    try { await onSend({ body: body.trim(), internal }); setBody(""); toast.success(internal ? "Note added" : "Reply sent"); }
    catch (err) { toast.error(errMsg(err, "Could not send")); }
    finally { setBusy(false); }
  };

  return (
    <Card className={cn("gap-0 p-3", internal && "border-amber-200 bg-amber-50")}>
      <form onSubmit={(e) => void send(e)} className="space-y-2">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "reply" | "note")}>
          <TabsList><TabsTrigger value="reply">Reply to customer</TabsTrigger><TabsTrigger value="note">Internal note</TabsTrigger></TabsList>
        </Tabs>
        <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} aria-label="Message"
          placeholder={internal ? "Only visible to support agents…" : "Write a reply to the customer…"} />
        <div className="flex justify-end"><Button disabled={busy || !body.trim()}>{busy ? "Sending…" : internal ? "Add note" : "Send reply"}</Button></div>
      </form>
    </Card>
  );
}
