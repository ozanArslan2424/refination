import { useAuth } from "@/hooks/use-auth";
import { useProfileData } from "@/hooks/use-profile-data";
import { db } from "@/lib/db";
import type { ProfileData } from "@/lib/schemas";
import { JoinSessionButton } from "@/pages/dashboard/join-session-button";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useOrganization } from "./use-organization";

export function DashboardPage() {
	console.count("🚀 Dashboard page rendered");

	const { user } = useAuth();
	const { profileData, isPending } = useProfileData(user?.uid);

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (!profileData) {
		return <p>Not logged in</p>;
	}

	return (
		<div className="container mx-auto space-y-6 px-16 py-8 lg:px-32">
			<h1>Welcome to Refination!</h1>
			<div className="grid grid-cols-1 gap-8 *:flex *:flex-col *:justify-between *:rounded-xl *:border *:p-8 sm:grid-cols-3">
				<JoinSessionButton profileData={profileData} />
				<ChangeOrganizationForm profileData={profileData} />
				<ChangeNameForm profileData={profileData} />
			</div>
		</div>
	);
}

function ChangeOrganizationForm({ profileData }: { profileData: ProfileData }) {
	const [orgId, setOrgId] = useState(profileData.user.orgId);

	const { organization } = useOrganization(orgId);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const newOrgId = formData.get("organization") as string;

		try {
			await db.runTransaction(async (transaction) => {
				const orgRef = db.ref("organizations", newOrgId);
				const orgDoc = await transaction.get(orgRef);

				if (!orgDoc.exists) {
					throw new Error("Organization does not exist");
				}

				const orgData = orgDoc.data();

				if (!orgData) {
					throw new Error("Organization data is missing");
				}

				const userRef = db.ref("users", profileData.user.id);
				transaction.update(userRef, { orgId: newOrgId });
				setOrgId(newOrgId);
			});
		} catch (error) {
			console.error(error);
			toast.error("Failed to change organization");
		}
	}

	return (
		<div>
			<h3>You can change your organization here.</h3>
			<p className="pb-4 font-medium text-muted-foreground">
				Current organization: {organization?.name}
			</p>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="organization">Enter New Organization ID</label>
					<input type="text" id="organization" name="organization" value={profileData.user.orgId} />
				</fieldset>

				<button type="submit">Change Organization</button>
			</form>
		</div>
	);
}

function ChangeNameForm({ profileData }: { profileData: ProfileData }) {
	const [name, setName] = useState(profileData.user.name);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const newName = formData.get("name") as string;

		try {
			await db.update("users", profileData.user.id, { name: newName });
		} catch (error) {
			console.error(error);
			toast.error("Failed to change name");
		} finally {
			setName(newName);
		}
	}

	return (
		<div>
			<h3>You can change your name here.</h3>
			<p className="pb-4 font-medium text-muted-foreground">Current name: {name}</p>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="name">New Name</label>
					<input type="text" id="name" name="name" />
				</fieldset>

				<button type="submit">Change Name</button>
			</form>
		</div>
	);
}
