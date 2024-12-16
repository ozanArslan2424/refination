import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { TableContent } from "@/pages/table/content";
import { SessionControls } from "@/pages/table/controls";
import { useVoteSession } from "@/pages/table/use-vote-session";
import { UserCircle } from "@/pages/table/users";

import { useAuth } from "@/hooks/use-auth";
import { useProfileData } from "@/hooks/use-profile-data";

export function TablePage() {
	console.count("🚀 Table page rendered");

	const { sessionId } = useParams<{ sessionId: string }>();

	const navigate = useNavigate();

	const { user } = useAuth();

	const { voteSession, isPending: isSessionLoading } = useVoteSession(sessionId);

	const { profileData, isPending: isProfileLoading } = useProfileData(user?.uid);

	useEffect(() => {
		if (!sessionId) {
			navigate("/");
		}
	}, [sessionId, navigate]);

	if (isSessionLoading || isProfileLoading) {
		return <p>Loading...</p>;
	}

	if (!(voteSession && profileData)) {
		return null;
	}

	const sessionUser = voteSession.users.find((u) => u.id === profileData.user.id);

	if (!sessionUser) {
		return null;
	}

	return (
		<>
			<SessionControls voteSession={voteSession} currentUser={sessionUser} />
			<div className="stack place-items-center pt-24">
				<div className="stack-item">
					<TableContent voteSession={voteSession} currentUser={sessionUser} />
				</div>
				<div className="stack-item">
					<UserCircle voteSession={voteSession} currentUser={sessionUser} />
				</div>
			</div>
		</>
	);
}
