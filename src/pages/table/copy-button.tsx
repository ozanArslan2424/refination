import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { useState } from "react";

export function CopyButton({ value, text }: { value: string; text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button type="button" onClick={handleCopy} className="gap-3">
      {text ? text : value}
      <div className="stack">
        <CheckIcon
          height={18}
          width={18}
          strokeWidth={4}
          aria-hidden="true"
          className={cn(
            "stack-item stroke-emerald-300 transition-all",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />

        <CopyIcon
          height={18}
          width={18}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(
            "stack-item transition-all",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
      </div>
    </button>
  );
}
