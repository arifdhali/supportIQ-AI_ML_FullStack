import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { fmtDate, initials } from "@/utils/format";
import type { Message } from "@/types";

export default function Conversation({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((m) => {
        const label = m.internal ? "Internal note" : m.role === "agent" ? "Support Agent" : "Customer";
        const style = m.internal ? "border-amber-200 bg-amber-50" : m.role === "customer" ? "bg-card" : "border-primary/20 bg-accent/60";
        return (
          <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className={cn("flex gap-3", m.role !== "customer" && "flex-row-reverse")}>
            <Avatar><AvatarFallback>{initials(m.sender)}</AvatarFallback></Avatar>
            <div className={cn("max-w-[80%] rounded-xl border p-3 text-sm", style)}>
              <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                {m.internal && <Lock className="size-3" />}{m.sender} · {label} · {fmtDate(m.createdAt)}
              </div>
              <p className="whitespace-pre-wrap">{m.body}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
