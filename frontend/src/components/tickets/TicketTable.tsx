import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge, StatusBadge, DepartmentBadge } from "@/components/shared/Badges";
import { cn } from "@/lib/utils";
import { fmtDate, ticketCode } from "@/utils/format";
import type { TicketSummary } from "@/types";

export type ColumnKey = "id" | "subject" | "customer" | "category" | "priority" | "status" | "department" | "agent" | "created" | "updated";
const COLS: Record<ColumnKey, [string, (t: TicketSummary) => ReactNode]> = {
  id: ["Ticket ID", (t) => <span className="font-mono text-xs">{ticketCode(t.id)}</span>],
  subject: ["Subject", (t) => <span className="block max-w-xs truncate font-medium">{t.subject}</span>],
  customer: ["Customer", (t) => t.customerName],
  category: ["Category", (t) => t.category],
  priority: ["Priority", (t) => <PriorityBadge value={t.priority} />],
  status: ["Status", (t) => <StatusBadge value={t.status} />],
  department: ["Department", (t) => <DepartmentBadge name={t.department} />],
  agent: ["Assigned Agent", (t) => t.assignedAgent ?? <span className="text-muted-foreground">Unassigned</span>],
  created: ["Created", (t) => <span className="whitespace-nowrap text-muted-foreground">{fmtDate(t.createdAt)}</span>],
  updated: ["Last Updated", (t) => <span className="whitespace-nowrap text-muted-foreground">{fmtDate(t.updatedAt)}</span>],
};

interface Props { tickets: TicketSummary[]; columns: ColumnKey[]; basePath: string; highlightHigh?: boolean }

export default function TicketTable({ tickets, columns, basePath, highlightHigh }: Props) {
  const nav = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((c) => <TableHead key={c}>{COLS[c][0]}</TableHead>)}
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((t, i) => (
          <motion.tr key={t.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 10) * 0.03 }}
            onClick={() => nav(`${basePath}/${t.id}`)}
            className={cn("cursor-pointer border-b transition-colors hover:bg-muted/50",
              highlightHigh && t.priority === "High" && !["Resolved", "Closed"].includes(t.status) && "border-l-2 border-l-destructive")}>
            {columns.map((c) => <TableCell key={c}>{COLS[c][1](t)}</TableCell>)}
            <TableCell><Link className="text-primary hover:underline" to={`${basePath}/${t.id}`} onClick={(e) => e.stopPropagation()}>View</Link></TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
