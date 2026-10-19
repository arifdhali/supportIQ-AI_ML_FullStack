import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const ErrorAlert = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <Alert variant="destructive">
    <AlertCircle />
    <AlertDescription className="flex items-center gap-3">{message}{onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>}</AlertDescription>
  </Alert>
);

export const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3 p-4">{Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
);
