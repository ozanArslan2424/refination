import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { SessionUser, VoteSession } from "@/lib/types";

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
			const x = Number.parseFloat((50 + 120 * Math.cos(angle)).toFixed(1));
			const y = Number.parseFloat((50 + 120 * Math.sin(angle)).toFixed(1));
			return { x, y };
		});
	}, [users]);

	function renderUserAvatar(
		state: VoteSession["state"],
		vote: SessionUser["vote"],
		isCurrentUser: boolean,
	) {
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
	}

	return (
		<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
			<div className="relative h-64 w-64">
				{users.map((user, index) => (
					<div
						key={user.id}
						className={cn(
							"absolute",
							currentUser.id === user.id && "rounded-full ring-4 ring-emerald-700",
						)}
						style={{
							left: `${userPositions[index].x}%`,
							top: `${userPositions[index].y}%`,
							transform: "translate(-50%, -50%)",
						}}
					>
						<div
							className={cn(
								"relative aspect-square h-24 rounded-full border-[5px] p-4",
								user.vote !== "X" || voteSession.state === "results"
									? "border-sky-700 bg-sky-700"
									: "border-sky-100",

								currentUser.id === user.id && "border-emerald-700 bg-emerald-700",
							)}
						>
							{user.role === "manager" && (
								<span className="-top-6 -translate-x-1/2 absolute left-1/2 z-[3] text-5xl">👑</span>
							)}

							<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-[2]">
								<span className="text-6xl text-stone-100">
									{renderUserAvatar(voteSession.state, user.vote, currentUser.id === user.id)}
								</span>
							</div>
							<span
								className={cn(
									"-bottom-6 -translate-x-1/2 absolute left-1/2 z-[1] inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-primary px-2.5 py-0.5 font-semibold text-lg text-primary-foreground",
									"bg-sky-100 text-sky-700",
								)}
							>
								<span>{user.name}</span>
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
