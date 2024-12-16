import { useAuth } from "@/hooks/use-auth";
import { useProfileData } from "@/hooks/use-profile-data";
import { auth } from "@/lib/firebase";
import { CreateProfileForm } from "@/pages/dashboard/create-profile-form";
import { JoinSessionButton } from "@/pages/dashboard/join-session-button";
import { useState } from "react";

export function DashboardPage() {
	console.count("🚀 Dashboard page rendered");

	const [_profileCreated, setProfileCreated] = useState(false);

	const { user } = useAuth();
	const { profileData, isPending } = useProfileData(user?.uid);

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (!auth.currentUser) {
		return <p>Not logged in</p>;
	}

	return (
		<div className="space-y-4 px-16 py-8 lg:px-32">
			<h1>Welcome to Refination!</h1>
			<div className="flex flex-col items-start justify-center gap-12 lg:flex-row">
				<div className="w-full space-y-4 lg:w-1/3">
					{profileData ? (
						<JoinSessionButton
							activeSessionId={profileData.organization.activeSessionId}
							profileData={profileData}
						/>
					) : (
						<CreateProfileForm authUser={auth.currentUser} setSuccess={setProfileCreated} />
					)}
				</div>
			</div>
		</div>
	);
}
