import { db } from "@/lib/db";
import type { DatabaseUser, Organization, ProfileData } from "@/lib/schemas";
import { useEffect, useState } from "react";

export function useProfileData(userId: string | undefined) {
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		if (!userId) {
			setIsPending(false);
			return;
		}

		async function fetchProfileData() {
			try {
				if (!userId) {
					setIsPending(false);
					throw new Error("No user ID provided");
				}

				const userData = await db.get<DatabaseUser>("users", userId);
				if (!userData) {
					setIsPending(false);
					return;
				}

				const orgData = await db.get<Organization>("organizations", userData.orgId);
				if (!orgData) {
					setIsPending(false);
					return;
				}

				setProfileData({ user: userData, organization: orgData });
			} catch (error) {
				console.error("Error fetching profile data:", error);
			} finally {
				setIsPending(false);
			}
		}

		fetchProfileData();
	}, [userId]);

	return { profileData, isPending };
}
