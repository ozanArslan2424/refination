import { UsernameForm } from "@/components/username-form"
import { db } from "@/lib/db"
import { VoteSession } from "@/lib/schemas"
import { getErrorMessage } from "@/lib/utils"
import { arrayUnion } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

export function InvitePage() {
	const [existingUser, setExistingUser] = useState<{ id: string; name: string } | null>(null)
	const [session, setSession] = useState<VoteSession | null>(null)
	const { sessionId = "" } = useParams<{ sessionId: string }>()
	const navigate = useNavigate()

	useEffect(() => {
		const userId = localStorage.getItem("userId") === "null" ? null : localStorage.getItem("userId")
		const userName =
			localStorage.getItem("username") === "null" ? null : localStorage.getItem("username")
		setExistingUser(userId && userName ? { id: userId, name: userName } : null)

		if (!sessionId) return
		db.get<VoteSession>("sessions", sessionId).then((data) => {
			setSession(data)
		})
	}, [])

	async function handleFinish(user: { id: string; name: string }) {
		try {
			await db.update("sessions", sessionId, {
				users: arrayUnion({ ...user, vote: "X" }),
			})

			await navigate(`/table/${sessionId}`)
		} catch (e) {
			const msg = getErrorMessage(e)
			toast.error(msg)
		}
	}

	if (!session) {
		return <p>Session not found</p>
	}

	return (
		<div className="container mx-auto space-y-6 px-16 py-8 lg:px-32">
			<h1>Welcome to Refination!</h1>
			<div className="flex flex-col items-center justify-center gap-4">
				<p>Session has {session.users.length} users</p>
				{existingUser ? (
					<p>User: {existingUser.name}</p>
				) : (
					<div className="card space-y-4 p-8">
						<h3 className="pb-4">Enter your name to continue</h3>
						<UsernameForm onFinish={handleFinish} existingUser={existingUser} actionLabel="Join" />
					</div>
				)}
			</div>
		</div>
	)
}
