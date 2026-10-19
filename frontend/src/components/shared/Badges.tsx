import { Badge } from "@/components/ui/badge";
import { PRIORITY_STYLES, STATUS_STYLES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Priority, Status } from "@/types";

const dot: Record<Priority, string> = { High: "bg-red-500", Medium: "bg-amber-500", Low: "bg-blue-500" };

export function PriorityBadge({ value }: { value: Priority | null }) {
  if (!value) return <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500">Pending triage</Badge>;
  return (
    <Badge variant="outline" className={PRIORITY_STYLES[value]}>
      <span className={cn("size-1.5 rounded-full", dot[value])} />{value}
    </Badge>
  );
}
export const StatusBadge = ({ value }: { value: Status }) => <Badge variant="outline" className={STATUS_STYLES[value]}>{value}</Badge>;
export const DepartmentBadge = ({ name }: { name: string }) => <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">{name}</Badge>;
