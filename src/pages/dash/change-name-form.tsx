import { db } from "@/lib/db"
import type { ProfileData } from "@/lib/schemas"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

export function ChangeNameForm({ profileData }: { profileData: ProfileData }) {
	const [name, setName] = useState(profileData.user.name)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const newName = formData.get("name") as string

		try {
			await db.update("users", profileData.user.id, { name: newName })
		} catch (error) {
			console.error(error)
			toast.error("Failed to change name")
		} finally {
			setName(newName)
		}
	}

	return (
		<div>
			<h3>Change name</h3>
			<p>Current name: {name}</p>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="name">New Name</label>
					<input type="text" id="name" name="name" />
				</fieldset>

				<button type="submit">Change Name</button>
			</form>
		</div>
	)
}
