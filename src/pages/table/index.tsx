import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { TableContent } from "@/pages/table/content"
import { SessionControls } from "@/pages/table/controls"
import { useVoteSession } from "@/pages/table/use-vote-session"
import { UserCircle } from "@/pages/table/users"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/utils"
import { arrayUnion } from "firebase/firestore"
import { toast } from "sonner"
import { UsernameForm } from "@/components/username-form"

export function TablePage() {
	const [existingUser, setExistingUser] = useState<{ id: string; name: string } | null>(null)
	useEffect(() => {
		const userId = localStorage.getItem("userId") === "null" ? null : localStorage.getItem("userId")
		const userName =
			localStorage.getItem("username") === "null" ? null : localStorage.getItem("username")
		setExistingUser(userId && userName ? { id: userId, name: userName } : null)
	}, [])

	const { sessionId = "" } = useParams<{ sessionId: string }>()
	const { voteSession, isPending } = useVoteSession(sessionId)

	async function handleFinish(user: { id: string; name: string }) {
		try {
			await db.update("sessions", sessionId, {
				users: arrayUnion({ ...user, vote: "X" }),
			})

			setExistingUser(user)
		} catch (e) {
			const msg = getErrorMessage(e)
			toast.error(msg)
		}
	}

	if (isPending) {
		return <p>Loading...</p>
	}

	if (!voteSession) {
		return <p>Session not found</p>
	}

	const sessionUser = voteSession.users.find((u) => u.id === existingUser?.id)

	if (!existingUser || !sessionUser) {
		return (
			<div className="container mx-auto space-y-6 px-16 py-8 lg:px-32">
				<h1>Welcome to Refination!</h1>
				<div className="flex flex-col items-center justify-center gap-4">
					<p>Session has {voteSession.users.length} users</p>
					<div className="card space-y-4 p-8">
						<h3 className="pb-4">Enter your name to continue</h3>
						<UsernameForm onFinish={handleFinish} existingUser={existingUser} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			<SessionControls voteSession={voteSession} />
			<div className="stack place-items-center pt-24">
				<div className="stack-item">
					<TableContent voteSession={voteSession} currentUser={sessionUser} />
				</div>
				<div className="stack-item">
					<UserCircle voteSession={voteSession} currentUser={sessionUser} />
				</div>
			</div>
		</>
	)
}
