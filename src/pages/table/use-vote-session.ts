import { db } from "@/lib/db"
import { type VoteSession, sessionDocSchema } from "@/lib/schemas"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function useVoteSession(sessionId: string | undefined) {
	const [voteSession, setVoteSession] = useState<VoteSession | null>(null)
	const [isPending, setIsPending] = useState(true)

	useEffect(() => {
		if (!sessionId) return

		const unsub = db.listen("sessions", sessionId, {
			next: (doc) => {
				const voteSession = doc.data()
				const { data, error } = sessionDocSchema.safeParse(voteSession)
				if (error) {
					console.error("Session error: ", error)
					toast.error("Session not found")
					return
				}
				setVoteSession(data)
				setIsPending(false)
			},
			error: () => {
				toast.error("Failed to get session")
				setIsPending(false)
			},
		})

		return () => unsub()
	}, [sessionId])

	return { voteSession, isPending }
}
