import { db } from "@/lib/db"
import { Organization, type ProfileData } from "@/lib/schemas"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"

export function ChangeOrganizationForm({ profileData }: { profileData: ProfileData }) {
	const [orgId, setOrgId] = useState(profileData.user.orgId)
	const [organization, setOrganization] = useState<Organization | null>(null)

	useEffect(() => {
		db.get<Organization>("organizations", orgId).then((orgDoc) => {
			if (orgDoc) {
				setOrganization(orgDoc)
			}
		})
	}, [orgId])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const newOrgId = formData.get("organization") as string

		try {
			await db.runTransaction(async (transaction) => {
				const orgRef = db.ref("organizations", newOrgId)
				const orgDoc = await transaction.get(orgRef)

				if (!orgDoc.exists) {
					throw new Error("Organization does not exist")
				}

				const orgData = orgDoc.data()

				if (!orgData) {
					throw new Error("Organization data is missing")
				}

				const userRef = db.ref("users", profileData.user.id)
				transaction.update(userRef, { orgId: newOrgId })
				setOrgId(newOrgId)
			})
		} catch (error) {
			console.error(error)
			toast.error("Failed to change organization")
		}
	}

	return (
		<div>
			<h3>Change organization</h3>
			<p>Current organization: {organization?.name}</p>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="organization">Enter New Organization ID</label>
					<input type="text" id="organization" name="organization" value={profileData.user.orgId} />
				</fieldset>

				<button type="submit">Change Organization</button>
			</form>
		</div>
	)
}
