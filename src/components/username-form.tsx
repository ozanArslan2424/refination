import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/utils"
import { FormEvent } from "react"
import { toast } from "sonner"

export function UsernameForm({
	existingUser,
	onFinish,
	actionLabel = "Create",
}: {
	existingUser: { id: string; name: string } | null | undefined
	onFinish?: (user: { id: string; name: string }) => void
	actionLabel?: string
}) {
	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const name = formData.get("username") as string

		const userId = crypto.randomUUID()

		localStorage.setItem("userId", userId)
		localStorage.setItem("username", name)

		try {
			if (existingUser) {
				await db.update("users", existingUser.id, { name })
			} else {
				await db.set("users", userId, { id: userId, name })
			}
			onFinish?.({ id: userId, name })
		} catch (e) {
			const msg = getErrorMessage(e)
			toast.error(msg)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				id="username"
				name="username"
				type="text"
				placeholder="Username"
				autoFocus
				defaultValue={existingUser?.name}
			/>
			<button type="submit" className="w-full">
				{actionLabel}
			</button>
		</form>
	)
}
