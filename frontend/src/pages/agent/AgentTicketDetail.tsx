import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useAuth";
import { useAsync } from "@/hooks/useAsync";
import { ticketsService } from "@/services/tickets.service";
import { departmentsService } from "@/services/departments.service";
import { aiService } from "@/services/ai.service";
import { PRIORITIES, STATUS_TRANSITIONS } from "@/constants";
import { StatusBadge } from "@/components/shared/Badges";
import { ErrorAlert, ListSkeleton } from "@/components/shared/states";
import Conversation from "@/components/shared/Conversation";
import ServerSelect from "@/components/shared/ServerSelect";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReplyComposer from "@/components/tickets/ReplyComposer";
import ActivityTimeline from "@/components/tickets/ActivityTimeline";
import AIPanel from "@/components/tickets/AIPanel";
import { Card } from "@/components/ui/card";
import { errMsg } from "@/utils/error";
import { fmtDate, initials, ticketCode } from "@/utils/format";
import type { Agent, Priority, Status, Ticket } from "@/types";

export default function AgentTicketDetail() {
  const { ticketId = "" } = useParams();
  const user = useUser();
  const { data: t, loading, error, reload, setData } = useAsync(() => ticketsService.getAgent(ticketId, user), [ticketId]);
  const ai = useAsync(() => aiService.get(ticketId), [ticketId]);
  const depts = useAsync(() => departmentsService.list(user), []);
  const agents = useAsync(() => (t ? departmentsService.agentsOf(t.departmentId, user) : Promise.resolve<Agent[]>([])), [t?.departmentId]);
  const [applying, setApplying] = useState(false);

  if (loading) return <ListSkeleton rows={8} />;
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!t) return <ErrorAlert message="Ticket not found." />;

  // The UI updates only after the server confirms; failures throw into ServerSelect, which restores the old value.
  const commit = (fn: (v: string) => Promise<Ticket>, msg: string) => async (v: string) => { setData(await fn(v)); toast.success(msg); };
  const canAssign = !!user.permissions?.canAssign;

  const applySuggestion = async () => {
    const suggested = ai.data?.priority;
    if (!suggested) return;
    setApplying(true);
    try { setData(await ticketsService.setPriority(t.id, suggested, user)); toast.success("AI suggestion applied"); }
    catch (e) { toast.error(errMsg(e, "Could not apply suggestion")); }
    finally { setApplying(false); }
  };

  return (
    <>
      <Link to="/agent/tickets" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to tickets</Link>
      <div className="mb-1 flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-muted-foreground">{ticketCode(t.id)}</span>
        <h1 className="text-xl font-semibold tracking-tight">{t.subject}</h1>
        <StatusBadge value={t.status} />
      </div>
      <p className="mb-6 text-sm text-muted-foreground">Created {fmtDate(t.createdAt)} · Updated {fmtDate(t.updatedAt)}</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Conversation messages={t.messages} />
          <ReplyComposer onSend={async (p) => setData(await ticketsService.addAgentMessage(t.id, p, user))} />
          <ActivityTimeline history={t.history} />
        </div>
        <aside className="space-y-4">
          <Card className="gap-3 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10"><AvatarFallback>{initials(t.customerName)}</AvatarFallback></Avatar>
              <div className="text-sm"><div className="font-medium">{t.customerName}</div><div className="text-muted-foreground">{t.customerEmail}</div></div>
            </div>
            <div className="text-sm text-muted-foreground">Category: <span className="text-foreground">{t.category}</span></div>
            <ServerSelect label="Priority" placeholder="Set priority" value={t.priority} options={[...PRIORITIES]}
              onCommit={commit((v) => ticketsService.setPriority(t.id, v as Priority, user), "Priority updated")} />
            <ServerSelect label="Status" value={t.status} options={[t.status, ...STATUS_TRANSITIONS[t.status]]}
              onCommit={commit((v) => ticketsService.setStatus(t.id, v as Status, user), "Status updated")} />
            <ServerSelect label="Department" value={t.departmentId} disabled={!canAssign}
              options={(depts.data ?? []).map((d) => ({ value: String(d.id), label: d.name }))}
              onCommit={commit((v) => ticketsService.assign(t.id, { departmentId: Number(v) }, user), "Department updated")} />
            <ServerSelect label="Assigned agent" value={t.assignedAgentId ?? ""} disabled={!canAssign}
              options={[{ value: "", label: "Unassigned" }, ...(agents.data ?? []).map((a) => ({ value: String(a.id), label: a.name }))]}
              onCommit={commit((v) => ticketsService.assign(t.id, { agentId: v ? Number(v) : null }, user), "Assignment updated")} />
          </Card>
          <AIPanel analysis={ai.data} currentPriority={t.priority} onApply={() => void applySuggestion()} applying={applying} />
        </aside>
      </div>
    </>
  );
}
