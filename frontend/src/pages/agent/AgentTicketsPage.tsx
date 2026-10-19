import { useMemo, useState } from "react";
import { Inbox, Search } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { useAsync } from "@/hooks/useAsync";
import { ticketsService } from "@/services/tickets.service";
import { departmentsService } from "@/services/departments.service";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/constants";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorAlert, ListSkeleton } from "@/components/shared/states";
import TicketTable, { type ColumnKey } from "@/components/tickets/TicketTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ticketCode } from "@/utils/format";
import type { Priority } from "@/types";

const RANK: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
const INIT = { q: "", status: "", priority: "", department: "", agent: "", category: "", from: "", to: "", sort: "updated" };
type Filters = typeof INIT;
const TABS = ["", "Open", "In Progress", "Waiting for Customer", "Resolved"];

// mode="mine": tickets assigned to me. mode="all": everything inside my authorized scope.
export default function AgentTicketsPage({ mode }: { mode: "mine" | "all" }) {
  const user = useUser();
  const mine = mode === "mine";
  const { data, loading, error, reload } = useAsync(() => (mine ? ticketsService.listAssigned(user) : ticketsService.listScoped(user)), [mode]);
  const depts = useAsync(() => departmentsService.list(user), []);
  const [f, setF] = useState<Filters>(INIT);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const set = (k: keyof Filters) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setPage(1); };

  const rows = useMemo(() => {
    const q = f.q.toLowerCase();
    const key = f.sort === "created" ? "createdAt" : "updatedAt";
    return (data ?? []).filter((t) =>
      (!f.status || t.status === f.status) && (!f.priority || t.priority === f.priority) &&
      (!f.department || t.department === f.department) && (!f.category || t.category === f.category) &&
      (!f.agent || (f.agent === "Unassigned" ? !t.assignedAgent : t.assignedAgent === f.agent)) &&
      (!f.from || new Date(t.createdAt) >= new Date(f.from)) && (!f.to || new Date(t.createdAt) <= new Date(`${f.to}T23:59:59`)) &&
      `${ticketCode(t.id)} ${t.subject} ${t.customerName}`.toLowerCase().includes(q)
    ).sort((a, b) => f.sort === "priority"
      ? (b.priority ? RANK[b.priority] : 0) - (a.priority ? RANK[a.priority] : 0) || +new Date(b.updatedAt) - +new Date(a.updatedAt)
      : +new Date(b[key]) - +new Date(a[key]));
  }, [data, f]);

  const agents = [...new Set((data ?? []).map((t) => t.assignedAgent).filter((x): x is string => !!x)), "Unassigned"];
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const pageRows = rows.slice((page - 1) * size, page * size);
  const cols: ColumnKey[] = mine
    ? ["id", "subject", "customer", "category", "priority", "status", "department", "created", "updated"]
    : ["id", "subject", "customer", "category", "priority", "status", "department", "agent", "created", "updated"];
  const scopeText = user.permissions?.crossDepartment ? "all departments" : user.department?.name ?? "your department";

  // local render helper (not a component): a filter dropdown built from shadcn NativeSelect
  const sel = (k: keyof Filters, all: string, opts: readonly string[], w = "w-44") => (
    <NativeSelect aria-label={all} className={w} value={f[k]} onChange={(e) => set(k)(e.target.value)}>
      <NativeSelectOption value="">{all}</NativeSelectOption>
      {opts.map((o) => <NativeSelectOption key={o} value={o}>{o}</NativeSelectOption>)}
    </NativeSelect>
  );

  return (
    <>
      <PageHeader title={mine ? "My Tickets" : "All Tickets"}
        subtitle={mine ? "Manage and resolve tickets assigned to you." : `${rows.length} tickets in your scope (${scopeText}, plus tickets assigned to you).`} />
      {mine && (
        <Tabs value={f.status || "all"} onValueChange={(v) => set("status")(v === "all" ? "" : v)} className="mb-4">
          <TabsList>
            {TABS.map((s) => <TabsTrigger key={s || "all"} value={s || "all"}>{s || "All Assigned"} ({(data ?? []).filter((t) => !s || t.status === s).length})</TabsTrigger>)}
          </TabsList>
        </Tabs>
      )}
      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-wrap gap-2 border-b p-3">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search ID, subject or customer" value={f.q} onChange={(e) => set("q")(e.target.value)} />
          </div>
          {!mine && sel("status", "All statuses", STATUSES)}
          {sel("priority", "All priorities", PRIORITIES, "w-40")}
          {sel("department", "All departments", (depts.data ?? []).map((d) => d.name), "w-48")}
          {!mine && user.permissions?.canAssign && sel("agent", "All agents", agents, "w-40")}
          {!mine && sel("category", "All categories", CATEGORIES)}
          {!mine && <>
            <Input type="date" aria-label="From date" className="w-auto" value={f.from} onChange={(e) => set("from")(e.target.value)} />
            <Input type="date" aria-label="To date" className="w-auto" value={f.to} onChange={(e) => set("to")(e.target.value)} />
          </>}
          <NativeSelect aria-label="Sort" className="w-48" value={f.sort} onChange={(e) => set("sort")(e.target.value)}>
            <NativeSelectOption value="updated">Sort: Last updated</NativeSelectOption>
            <NativeSelectOption value="created">Sort: Created date</NativeSelectOption>
            <NativeSelectOption value="priority">Sort: Priority</NativeSelectOption>
          </NativeSelect>
          <Button variant="outline" onClick={() => { setF(INIT); setPage(1); }}>Clear filters</Button>
        </div>
        {error ? <div className="p-4"><ErrorAlert message={error} onRetry={reload} /></div> : loading ? <ListSkeleton rows={6} />
          : rows.length === 0 ? <Empty><EmptyHeader><EmptyMedia variant="icon"><Inbox /></EmptyMedia><EmptyTitle>No tickets found</EmptyTitle><EmptyDescription>Try changing or clearing your filters.</EmptyDescription></EmptyHeader></Empty>
          : <TicketTable tickets={pageRows} basePath="/agent/tickets" columns={cols} highlightHigh />}
        {!loading && !error && rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3 text-sm text-muted-foreground">
            <span>{(page - 1) * size + 1}–{Math.min(page * size, rows.length)} of {rows.length}</span>
            <div className="flex items-center gap-3">
              <NativeSelect aria-label="Rows per page" className="w-28" value={String(size)} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}>
                {[5, 10, 25, 50].map((n) => <NativeSelectOption key={n} value={String(n)}>{n} / page</NativeSelectOption>)}
              </NativeSelect>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" aria-disabled={page <= 1} className={page <= 1 ? "pointer-events-none opacity-50" : ""} onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} /></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>{page} / {pages}</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" aria-disabled={page >= pages} className={page >= pages ? "pointer-events-none opacity-50" : ""} onClick={(e) => { e.preventDefault(); if (page < pages) setPage(page + 1); }} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
