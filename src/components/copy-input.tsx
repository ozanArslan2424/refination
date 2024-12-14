import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";

export function CopyInput({
  copyId,
  className,
  ...rest
}: React.ComponentProps<"input"> & { copyId?: HTMLButtonElement["id"] }) {
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleCopy() {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={cn("pe-9", className)}
        type="text"
        readOnly
        {...rest}
      />
      <button
        id={copyId}
        onClick={handleCopy}
        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        disabled={copied}
      >
        <div
          className={cn(
            "transition-all",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        >
          <CheckIcon
            className="stroke-emerald-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <div
          className={cn(
            "absolute transition-all",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <CopyIcon size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </button>
    </div>
  );
}
