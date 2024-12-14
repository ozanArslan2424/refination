import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";

export function CopyInput({
	copyId,
	className,
	...rest
}: ComponentProps<"input"> & { copyId?: HTMLButtonElement["id"] }) {
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
				readOnly={true}
				{...rest}
			/>
			<button
				type="button"
				id={copyId}
				onClick={handleCopy}
				className={cn(
					"default",
					"absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md border border-transparent text-muted-foreground transition-colors duration-75",
					"hover:text-foreground",
					"focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
					"disabled:pointer-events-none disabled:cursor-not-allowed",
				)}
				aria-label={copied ? "Copied" : "Copy to clipboard"}
				disabled={copied}
			>
				<div
					className={cn("transition-all", copied ? "scale-100 opacity-100" : "scale-0 opacity-0")}
				>
					<CheckIcon className="stroke-emerald-300" size={18} strokeWidth={4} aria-hidden="true" />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
					)}
				>
					<CopyIcon size={18} strokeWidth={2} aria-hidden="true" />
				</div>
			</button>
		</div>
	);
}
