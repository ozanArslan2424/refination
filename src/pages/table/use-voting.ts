import { db } from "@/lib/db";
import type { SessionUser, VoteOptions, VoteSession } from "@/lib/schemas";
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

	return { selectedVote, handleVote };
}
