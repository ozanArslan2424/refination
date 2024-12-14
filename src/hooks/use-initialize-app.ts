import { createSession, findUser } from "@/lib/auth";
import type { User } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";

export function useInitializeApp() {
	const [foundUser, setFoundUser] = useState<User | null>(null);
	const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		startTransition(() => {
			async function findUserAndCreateSession() {
				const userData = await findUser();
				if (!userData) return;

				setFoundUser(userData);

				const newVoteSession = await createSession(userData);
				if (!newVoteSession) throw new Error("Failed to create session");

				setActiveSessionId(newVoteSession.id);
			}

			findUserAndCreateSession();
		});
	}, []);

	return { foundUser, activeSessionId, isPending };
}
