import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { CopyButton } from "@/pages/table/copy-button";

import { db } from "@/lib/db";
import type { Organization, SessionUser, VoteSession } from "@/lib/schemas";

export function SessionControls({
	voteSession,
	currentUser,
}: {
	voteSession: VoteSession;
	currentUser: SessionUser;
}) {
	const navigate = useNavigate();

	const baseUrl = z.string().parse(import.meta.env.VITE_BASE_URL);

	async function handleCloseSession() {
		const confirmed = confirm("Are you sure you want to close the session?");
		if (!confirmed) return;

		await db.update<Partial<VoteSession>>("sessions", voteSession.id, {
			state: "closed",
		});

		await db.update<Partial<Organization>>("organizations", voteSession.orgId, {
			activeSessionId: "",
		});

		toast.success("Session closed");
		await navigate("/");
	}

	async function handleUserLeave() {
		const confirmed = confirm("Are you sure you want to leave the session?");
		if (!confirmed) return;

		await db.update("sessions", voteSession.id, {
			users: db.arrayRemove(currentUser),
		});

		toast.success("You've left the session");
		await navigate("/");
	}

	return (
		<header>
			<div className="flex items-center justify-between px-16 py-4">
				<h3 className="capitalize">{} Organization</h3>
				<nav className="flex items-center gap-2">
					<CopyButton text="Copy Organization Id" value={voteSession.orgId} />
					<CopyButton text="Copy Invite" value={`${baseUrl}/table/${voteSession.id}`} />
					<button
						type="button"
						className="error"
						onClick={currentUser.role === "manager" ? handleCloseSession : handleUserLeave}
					>
						{currentUser.role === "manager" ? "Close Table" : "Leave Table"}
					</button>
				</nav>
			</div>
		</header>
	);
}
