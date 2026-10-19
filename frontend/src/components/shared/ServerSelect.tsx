import { useState } from "react";
import { toast } from "sonner";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { errMsg } from "@/utils/error";

export interface Option { value: string; label: string }
interface Props {
  label: string; value: string | number | null; options: Array<string | Option>;
  onCommit: (v: string) => Promise<void>; placeholder?: string; disabled?: boolean;
}

// Shows the chosen value while saving; the parent updates `value` only after the server confirms.
// On failure the previous value is restored and an error toast is shown.
export default function ServerSelect({ label, value, options, onCommit, placeholder = "Select…", disabled }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const opts: Option[] = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = String(value ?? "");
  const change = async (v: string) => {
    setPending(v);
    try { await onCommit(v); }
    catch (err) { toast.error(errMsg(err, "Update failed")); }
    finally { setPending(null); }
  };
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="relative w-fit max-w-full">
        <NativeSelect aria-label={label} className="w-72 max-w-full" value={pending ?? current} disabled={disabled || pending !== null} onChange={(e) => void change(e.target.value)}>
          {current === "" && !opts.some((o) => o.value === "") && <NativeSelectOption value="" disabled>{placeholder}</NativeSelectOption>}
          {opts.map((o) => <NativeSelectOption key={o.value} value={o.value}>{o.label}</NativeSelectOption>)}
        </NativeSelect>
        {pending !== null && <Spinner className="absolute top-2.5 right-8" />}
      </div>
    </div>
  );
}
