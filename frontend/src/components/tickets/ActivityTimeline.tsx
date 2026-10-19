import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fmtDate } from "@/utils/format";
import type { HistoryEntry } from "@/types";

export default function ActivityTimeline({ history }: { history: HistoryEntry[] }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Collapsible className="group/activity">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-semibold">
          Activity history ({history.length})
          <ChevronDown className="size-4 transition-transform group-data-[state=open]/activity:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <ol className="space-y-3 p-4">
            {[...history].reverse().map((h) => (
              <li key={h.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div><div>{h.text}</div><div className="text-xs text-muted-foreground">{h.actor} · {fmtDate(h.at)}</div></div>
              </li>
            ))}
          </ol>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
