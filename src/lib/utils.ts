import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown) {
	let message: string

	if (error instanceof Error) {
		message = error.message
	} else if (error && typeof error === "object" && "message" in error) {
		message = String(error.message)
	} else if (typeof error === "string") {
		message = error
	} else {
		message = "Something went wrong"
	}

	const currentFilePath = new Error().stack?.split("\n")[2].split(" ").pop()
	const currentFileName = currentFilePath?.split("/").pop()

	console.error("🎣 Caught Error:", currentFileName, message)
	return message
}

export function toReadableDate(date: string | number | Date) {
	const d = new Date(date)
	const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
	})
	const readableDate = dateTimeFormatter.format(d)
	return readableDate
}
