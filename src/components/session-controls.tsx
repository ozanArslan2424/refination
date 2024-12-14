import type { SessionUser, VoteSession } from "@/lib/types";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { useNavigate } from "react-router";

export function SessionControls({
	voteSession,
	currentUser,
}: {
	voteSession: VoteSession;
	currentUser: SessionUser;
}) {
	const navigate = useNavigate();

	async function handleLeaveTable() {
		if (currentUser.role === "manager") {
			const confirmed = confirm("The session will be deleted for all users. Are you sure?");
			if (!confirmed) return;

			await db.set("oldSessions", voteSession.id, {
				organization: currentUser.organization,
				users: voteSession.users,
				voteSession: voteSession,
				results: null,
				count: "end",
				date: voteSession.createdAt,
			});

			await db.delete("sessions", voteSession.id);

			toast.success("Session deleted");
			await navigate("/");
		}
	}
	return (
		<header>
			<div className="flex items-center justify-between px-16 py-4">
				<h3 className="capitalize">{currentUser.organization.name} Organization</h3>
				<nav>
					<button type="button" className="error" onClick={handleLeaveTable}>
						Leave Table
					</button>
				</nav>
			</div>
		</header>
	);
}
