import { db } from "@/lib/db";
import type { ProfileData, VoteSession } from "@/lib/schemas";
import { arrayUnion } from "firebase/firestore";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useTableActions(profileData: ProfileData | null) {
	const navigate = useNavigate();

	const handleNewTable = useCallback(async () => {
		if (!profileData) return;

		const sessionId = crypto.randomUUID();

		await db.set<VoteSession>("sessions", sessionId, {
			id: sessionId,
			orgId: profileData.organization.id,
			state: "idle",
			users: [{ ...profileData.user, vote: "X" }],
			results: {
				aggreement: 0,
				average: 0,
				votes: [],
			},
		});

		await db.update("organizations", profileData.organization.id, {
			activeSessionId: sessionId,
			sessionIds: arrayUnion(sessionId),
		});

		await navigate(`/table/${sessionId}`);
	}, [profileData, navigate]);

	const handleJoinTable = useCallback(async () => {
		if (!profileData) return;

		const sessionId = profileData.organization.activeSessionId;
		await db.update("sessions", sessionId, {
			users: arrayUnion({ ...profileData.user, vote: "X" }),
		});

		await navigate(`/table/${sessionId}`);
	}, [profileData, navigate]);

	return { handleNewTable, handleJoinTable };
}
