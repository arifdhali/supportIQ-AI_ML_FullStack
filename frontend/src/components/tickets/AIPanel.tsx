import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/shared/Badges";
import type { AIAnalysis, Priority } from "@/types";

interface Props { analysis: AIAnalysis | null; currentPriority: Priority | null; onApply: () => void; applying: boolean }

// AI outputs are suggestions and stay separate from confirmed ticket fields.
export default function AIPanel({ analysis, currentPriority, onApply, applying }: Props) {
  const row = (label: string, value: ReactNode) => value ? <div className="py-1.5 text-sm"><div className="text-xs text-muted-foreground">{label}</div>{value}</div> : null;
  return (
    <div className="rounded-xl border border-primary/25 bg-accent/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> AI analysis</div>
      {!analysis ? <p className="text-sm text-muted-foreground">No AI analysis is available for this ticket yet.</p> : (
        <>
          {analysis.mock && <p className="mb-2 rounded bg-card px-2 py-1 text-xs text-muted-foreground">Sample data (mock mode)</p>}
          {analysis.priority && row("Suggested priority (not confirmed)", <PriorityBadge value={analysis.priority} />)}
          {row("Predicted category", analysis.category)}
          {row("Sentiment", analysis.sentiment)}
          {row("Confidence", analysis.confidence != null && `${Math.round(analysis.confidence * 100)}%`)}
          {row("Summary", analysis.summary)}
          {row("Suggested response", analysis.suggestedResponse && <p className="rounded bg-card p-2 text-sm">{analysis.suggestedResponse}</p>)}
          {analysis.priority && analysis.priority !== currentPriority && (
            <Button className="mt-2 w-full" onClick={onApply} disabled={applying}>{applying ? "Applying…" : `Apply suggestion (${analysis.priority})`}</Button>
          )}
        </>
      )}
    </div>
  );
}
