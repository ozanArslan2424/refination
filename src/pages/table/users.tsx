import type { SessionUser, VoteSession } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";

export function UserCircle({
	voteSession,
	currentUser,
}: {
	voteSession: VoteSession;
	currentUser: SessionUser;
}) {
	const { users } = voteSession;

	const userPositions = useMemo(() => {
		const angleStep = (2 * Math.PI) / users.length;

		return users.map((_, index) => {
			const angle = index * angleStep;
			const x = Number.parseFloat((50 + 65 * Math.cos(angle)).toFixed(1));
			const y = Number.parseFloat((50 + 65 * Math.sin(angle)).toFixed(1));
			return { x, y };
		});
	}, [users]);

	const renderUserAvatar = useCallback(
		(state: VoteSession["state"], vote: SessionUser["vote"], isCurrentUser: boolean) => {
			switch (state) {
				case "idle":
					return isCurrentUser ? "🫵" : "😅";
				case "voting":
					return vote === "X" ? "🤔" : "🤫";
				case "results":
					return vote;
				default:
					return "🤷";
			}
		},
		[],
	);

	return (
		<div className="relative aspect-square min-w-[480px]">
			{users.map((user, i) => (
				<div
					key={user.id}
					style={{
						position: "absolute",
						left: `${userPositions[i].x}%`,
						top: `${userPositions[i].y}%`,
						transform: "translate(-50%, -50%)",
					}}
				>
					<div
						className={cn(
							"relative",
							"aspect-square h-24 w-24 rounded-full border-5 p-4",
							user.vote !== "X" ? "border-sky-700 bg-sky-700" : "border-sky-100",
							currentUser.id === user.id && "border-emerald-700 bg-emerald-700",
						)}
					>
						{user.role === "manager" && (
							<span className="translate-center absolute top-0 left-1/2 z-2 text-5xl">👑</span>
						)}

						<span className="absolute-center text-6xl text-stone-100">
							{renderUserAvatar(voteSession.state, user.vote, currentUser.id === user.id)}
						</span>

						<span className="translate-center -bottom-10 absolute left-1/2 h-max w-max rounded-full bg-sky-100 px-2.5 py-0.5 font-semibold text-lg text-sky-700">
							<span>{user.name}</span>
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
