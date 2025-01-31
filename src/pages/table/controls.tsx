import { CopyButton } from "@/pages/table/copy-button"
import type { VoteSession } from "@/lib/schemas"
import { db } from "@/lib/db"
import { arrayRemove } from "firebase/firestore"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function SessionControls({ voteSession }: { voteSession: VoteSession }) {
	const navigate = useNavigate()

	const userId = localStorage.getItem("userId") === "null" ? null : localStorage.getItem("userId")

	if (!voteSession || !userId) {
		return null
	}

	const sessionUser = voteSession.users.find((u) => u.id === userId)

	async function handleLeaveSession() {
		const confirmed = confirm("Are you sure you want to leave the session?")
		if (!confirmed) return

		await db.update("sessions", voteSession.id, {
			users: arrayRemove(sessionUser),
		})

		toast.success("You've left the session")
		await navigate("/dash")
	}

	return (
		<header>
			<div className="flex items-center justify-between px-16 py-4">
				<nav className="flex items-center gap-2">
					<CopyButton
						text="Copy Invite"
						value={`${import.meta.env.VITE_BASE_URL}/table/${voteSession.id}`}
					/>
					<button type="button" className="error" onClick={handleLeaveSession}>
						Leave Table
					</button>
				</nav>
			</div>
		</header>
	)
}
