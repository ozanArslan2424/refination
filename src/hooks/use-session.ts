import { db } from "@/lib/db";
import { voteSessionSchema } from "@/lib/schemas";
import type { VoteSession } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useSession(sessionId: string) {
	const [voteSession, setVoteSession] = useState<VoteSession | undefined>();

	const navigate = useNavigate();

	useEffect(() => {
		db.get("sessions", sessionId).then((doc) => {
			const parsed = voteSessionSchema.parse(doc);
			setVoteSession(parsed);
		});

		const unsubscribe = db.listen("sessions", sessionId, {
			next: (doc) => {
				const voteSession = doc.data();
				const { data, error } = voteSessionSchema.safeParse(voteSession);
				if (error) {
					toast.error("Session not found");
					navigate("/");
					return;
				}
				setVoteSession(data);
			},
			error: (error) => {
				console.error("Error getting session document:", error);
				toast.error("Failed to get session");
			},
		});

		return () => {
			unsubscribe();
		};
	}, [sessionId, navigate]);

	return voteSession;
}
