import type { ReactNode } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

const POINTS = [
  { icon: Zap, text: "Tickets routed to the right department automatically" },
  { icon: ShieldCheck, text: "Internal notes and customer details stay within your support team" },
];

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
            <span className="text-lg font-semibold tracking-tight">SupportIQ</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
      </motion.div>
      <div className="hidden items-center justify-center bg-accent/50 p-12 lg:flex">
        <div className="max-w-sm space-y-4">
          <p className="text-xl font-semibold tracking-tight">Smarter support. Faster resolution.</p>
          {POINTS.map(({ icon: Icon, text }, i) => (
            <motion.div key={text} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
              <Card className="flex-row gap-3 p-4 text-sm"><Icon className="size-5 shrink-0 text-primary" />{text}</Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
