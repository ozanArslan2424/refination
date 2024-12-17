import { db } from "@/lib/db";
import type {
	Organization,
	SessionUser,
	VoteOptions,
	VoteSession,
	VoteSessionResult,
} from "@/lib/schemas";
import { arrayUnion } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useVoting(voteSession: VoteSession, currentUser: SessionUser) {
	const [selectedVote, setSelectedVote] = useState<VoteOptions>("X");

	const handleVote = useCallback(
		async (vote: VoteOptions) => {
			if (selectedVote === vote) return;

			setSelectedVote(vote);

			try {
				await db.runTransaction(async (transaction) => {
					const sessionRef = db.ref("sessions", voteSession.id);
					const sessionDoc = await transaction.get(sessionRef);
					if (!sessionDoc.exists()) {
						throw new Error("Session does not exist!");
					}
					const sessionData = sessionDoc.data() as VoteSession;
					const updatedUsers = sessionData.users.map((user) =>
						user.id === currentUser.id ? { ...user, vote } : user,
					);
					transaction.update(sessionRef, { users: updatedUsers });
				});
			} catch {
				toast.error("Failed to cast vote");
				setSelectedVote("X");
			}
		},
		[selectedVote, voteSession.id, currentUser.id],
	);

	const startVoting = useCallback(async (voteSession: VoteSession) => {
		const promise = db.update<Partial<VoteSession>>("sessions", voteSession.id, {
			state: "voting",
			results: {
				aggreement: 0,
				average: 0,
				votes: [],
			},
			users: voteSession.users.map((user) => ({
				...user,
				vote: "X",
			})),
		});

		await promise;

		toast.promise(promise, {
			loading: "Starting new vote...",
			success: "Started!",
			error: "Failed to start new vote",
		});
	}, []);

	const startVotingAgain = useCallback(
		async (voteSession: VoteSession, results: VoteSessionResult, orgId: string) => {
			const resultedSessionId = crypto.randomUUID();
			const promise = Promise.all([
				db.set<VoteSession>("sessions", resultedSessionId, {
					id: resultedSessionId,
					orgId: voteSession.orgId,
					results,
					state: "closed",
					users: voteSession.users,
				}),
				db.update<Partial<VoteSession>>("sessions", voteSession.id, {
					state: "voting",
					results: {
						aggreement: 0,
						average: 0,
						votes: [],
					},
					users: voteSession.users.map((user) => ({
						...user,
						vote: "X",
					})),
				}),
				db.update<Partial<Organization>>("organizations", orgId, {
					sessionIds: arrayUnion(resultedSessionId),
				}),
			]);

			await promise;
		},
		[],
	);

	return { selectedVote, handleVote, startVoting, startVotingAgain, setSelectedVote };
}
