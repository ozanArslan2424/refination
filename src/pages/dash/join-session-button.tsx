import type { ProfileData } from "@/lib/schemas"
import { useSessionControls } from "@/pages/table/use-session-actions"
import { useVoteSession } from "@/pages/table/use-vote-session"

export function JoinSessionButton({ profileData }: { profileData: ProfileData }) {
	const { handleCloseSession, handleJoinSession, handleNewSession } =
		useSessionControls(profileData)

	const { voteSession } = useVoteSession(profileData.organization.activeSessionId)

	if (voteSession && profileData.organization.activeSessionId !== "") {
		return (
			<div>
				<div>
					<h3>You have an active session!</h3>
					<p>{voteSession?.users.length} users are waiting.</p>
				</div>
				<div className="space-y-4">
					<button
						type="button"
						className="primary lg w-full animate-pulse hover:animate-none"
						onClick={handleJoinSession}
					>
						Click here to join.
					</button>
					<button type="button" className="lg hover:text-error w-full" onClick={handleCloseSession}>
						Close active session.
					</button>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div>
				<h3>You don&apos;t have an active session yet.</h3>
				<p>Create a new table to start a session.</p>
			</div>
			<button type="button" className="primary" onClick={handleNewSession}>
				Create New Table
			</button>
		</div>
	)
}
