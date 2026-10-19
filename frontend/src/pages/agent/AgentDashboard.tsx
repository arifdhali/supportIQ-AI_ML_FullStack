import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Inbox } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { useUser } from "@/hooks/useAuth";
import { useAsync } from "@/hooks/useAsync";
import { ticketsService } from "@/services/tickets.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorAlert, ListSkeleton } from "@/components/shared/states";
import { FadeIn } from "@/components/shared/Motion";
import TicketTable from "@/components/tickets/TicketTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { STATUSES } from "@/constants";
import { fmtDate, ticketCode } from "@/utils/format";
import type { Priority, TicketSummary } from "@/types";

const RANK: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
const done = (t: TicketSummary) => t.status === "Resolved" || t.status === "Closed";
const volumeConfig = { count: { label: "Tickets", color: "var(--chart-1)" } } satisfies ChartConfig;
const priorityConfig = {
  value: { label: "Tickets" },
  High: { label: "High", color: "#DC2626" }, Medium: { label: "Medium", color: "#D97706" },
  Low: { label: "Low", color: "#2563EB" }, Unset: { label: "Pending triage", color: "#94A3B8" },
} satisfies ChartConfig;

export default function AgentDashboard() {
  const user = useUser();
  const { data, loading, error, reload } = useAsync(() => ticketsService.listScoped(user), [user.id]);

  const m = useMemo(() => {
    const all = data ?? [];
    const mine = all.filter((t) => t.assignedAgentId === user.id);
    const today = new Date().toDateString();
    const queue = all.filter((t) => !done(t)).sort((a, b) => (b.priority ? RANK[b.priority] : 0) - (a.priority ? RANK[a.priority] : 0) || +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return {
      open: mine.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      high: all.filter((t) => t.priority === "High" && !done(t)).length,
      waiting: mine.filter((t) => t.status === "Waiting for Customer").length,
      resolvedToday: mine.filter((t) => t.status === "Resolved" && new Date(t.updatedAt).toDateString() === today).length,
      queue: queue.slice(0, 6),
      prio: ["High", "Medium", "Low", "Unset"].map((p) => ({ name: p, value: all.filter((t) => (t.priority ?? "Unset") === p).length, fill: `var(--color-${p})` })).filter((x) => x.value),
      volume: STATUSES.map((s) => ({ name: s === "Waiting for Customer" ? "Waiting" : s, count: all.filter((t) => t.status === s).length })),
      recent: [...all].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5),
    };
  }, [data, user.id]);

  const cards: Array<[string, number]> = [["My Open Tickets", m.open], ["High-Priority Tickets", m.high], ["Waiting for Customer", m.waiting], ["Resolved Today", m.resolvedToday]];

  return (
    <>
      <PageHeader title="Agent Dashboard"
        subtitle={`Hello, ${user.name} · ${user.department?.name ?? "Support"} · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
        action={<Link to="/agent/my-tickets" className={buttonVariants()}>Open My Tickets</Link>} />
      {error ? <ErrorAlert message={error} onRetry={reload} /> : loading || !data ? <ListSkeleton rows={6} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map(([label, value], i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -2 }}>
                <Card><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader></Card>
              </motion.div>
            ))}
          </div>
          <FadeIn delay={0.05}>
            <Card className="gap-0 overflow-hidden">
              <CardHeader className="pb-3"><CardTitle>Tickets Requiring Attention</CardTitle></CardHeader>
              {m.queue.length ? <TicketTable tickets={m.queue} basePath="/agent/tickets" highlightHigh columns={["id", "subject", "customer", "priority", "status", "department", "agent", "updated"]} />
                : <Empty><EmptyHeader><EmptyMedia variant="icon"><Inbox /></EmptyMedia><EmptyTitle>All caught up</EmptyTitle><EmptyDescription>Nothing needs attention right now.</EmptyDescription></EmptyHeader></Empty>}
            </Card>
          </FadeIn>
          <div className="grid gap-6 lg:grid-cols-3">
            <FadeIn delay={0.1}>
              <Card className="h-full"><CardHeader><CardTitle>Ticket volume by status</CardTitle></CardHeader>
                <CardContent>
                  <ChartContainer config={volumeConfig} className="h-52 w-full">
                    <BarChart data={m.volume}><CartesianGrid vertical={false} /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="count" fill="var(--color-count)" radius={4} /></BarChart>
                  </ChartContainer>
                </CardContent></Card>
            </FadeIn>
            <FadeIn delay={0.15}>
              <Card className="h-full"><CardHeader><CardTitle>Priority distribution</CardTitle></CardHeader>
                <CardContent>
                  <ChartContainer config={priorityConfig} className="mx-auto h-52 w-full">
                    <PieChart><ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} /><Pie data={m.prio} dataKey="value" nameKey="name" innerRadius={40} /></PieChart>
                  </ChartContainer>
                </CardContent></Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card className="h-full"><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {m.recent.map((t) => (
                      <li key={t.id}><Link to={`/agent/tickets/${t.id}`} className="font-medium hover:text-primary">{ticketCode(t.id)} · {t.subject}</Link>
                        <div className="text-xs text-muted-foreground">{t.customerName} · {t.status} · {fmtDate(t.updatedAt)}</div></li>
                    ))}
                  </ul>
                </CardContent></Card>
            </FadeIn>
          </div>
        </div>
      )}
    </>
  );
}
