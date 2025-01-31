import { db } from "@/lib/db"
import { ProfileData, DatabaseUser } from "@/lib/schemas"
import { getErrorMessage } from "@/lib/utils"
import { FormEvent } from "react"
import { toast } from "sonner"

export function ChangeRoleForm({ profileData }: { profileData: ProfileData }) {
	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const role = formData.get("role") as DatabaseUser["role"]

		try {
			await db.update<Partial<DatabaseUser>>("users", profileData.user.id, { role })
		} catch (error) {
			const message = getErrorMessage(error)
			toast.error(message)
		}
	}

	return (
		<div>
			<h3>Change role</h3>
			<p>Only managers can start voting sessions.</p>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label>Role</label>
					<select id="role" name="role" defaultValue={profileData.user.role}>
						<option value="employee">Employee</option>
						<option value="manager">Manager</option>
					</select>
				</fieldset>
				<button type="submit">Change Role</button>
			</form>
		</div>
	)
}
