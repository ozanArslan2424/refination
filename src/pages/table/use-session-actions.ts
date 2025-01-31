import { db } from "@/lib/db"
import {
	type Organization,
	sessionDocSchema,
	type ProfileData,
	type VoteSession,
} from "@/lib/schemas"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { useCallback } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function useSessionControls(profileData: ProfileData | null) {
	const navigate = useNavigate()

	const handleNewSession = useCallback(async () => {
		if (!profileData) return

		const sessionId = crypto.randomUUID()

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
		})

		await db.update("organizations", profileData.organization.id, {
			activeSessionId: sessionId,
			sessionIds: arrayUnion(sessionId),
		})

		await navigate(`/table/${sessionId}`)
	}, [profileData, navigate])

	const handleJoinSession = useCallback(async () => {
		if (!profileData) return

		const sessionId = profileData.organization.activeSessionId

		await db.runTransaction(async (transaction) => {
			const sessionRef = db.ref("sessions", sessionId)
			const sessionDoc = await transaction.get(sessionRef)
			const sessionData = sessionDoc.data()

			const { error, data } = sessionDocSchema.safeParse(sessionData)

			if (error) {
				console.error("Session error: ", error)
				toast.error("Session not found")
				return
			}

			const userExists = data.users.some((user) => user.id === profileData.user.id)

			if (!userExists) {
				transaction.update(sessionRef, {
					users: arrayUnion({ ...profileData.user, vote: "X" }),
				})
			}

			await navigate(`/table/${sessionId}`)
		})
	}, [profileData, navigate])

	const handleCloseSession = useCallback(async () => {
		if (!profileData) return

		const confirmed = confirm("Are you sure you want to close the session?")
		if (!confirmed) return

		await db.update<Partial<VoteSession>>("sessions", profileData.organization.activeSessionId, {
			state: "closed",
		})

		await db.update<Partial<Organization>>("organizations", profileData.user.orgId, {
			activeSessionId: "",
		})

		toast.success("Session closed")
	}, [profileData])

	const handleLeaveSession = useCallback(async () => {
		if (!profileData) return

		const confirmed = confirm("Are you sure you want to leave the session?")
		if (!confirmed) return

		await db.update("sessions", profileData.organization.activeSessionId, {
			users: arrayRemove(profileData.user),
		})

		toast.success("You've left the session")
		await navigate("/")
	}, [profileData, navigate])

	return { handleNewSession, handleJoinSession, handleCloseSession, handleLeaveSession }
}
