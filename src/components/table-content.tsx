import { useResults } from "@/hooks/use-results";
import { db } from "@/lib/db";
import type { SessionUser, VoteOptions, VoteSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TableContent({
	voteSession,
	currentUser,
}: {
	voteSession: VoteSession;
	currentUser: SessionUser;
}) {
	const [selectedVote, setSelectedVote] = useState<VoteOptions>("X");

	const sessionState = voteSession.state;
	const votes: VoteOptions[] = ["3", "5", "8", "13", "21", "X"];

	useEffect(() => {
		if (sessionState === "results") {
			setSelectedVote("X");
		}
	}, [sessionState]);

	const results = useResults(voteSession.users);

	async function handleStateChange() {
		switch (true) {
			case sessionState === "idle": {
				await db.update("sessions", voteSession.id, {
					state: "voting",
					users: voteSession.users.map((user) => ({ ...user, vote: "X" })),
				});
				break;
			}
			case sessionState === "voting": {
				await db.update("sessions", voteSession.id, { state: "results" });
				break;
			}
			case sessionState === "results": {
				await db.set("oldSessions", voteSession.id, {
					organization: currentUser.organization,
					users: voteSession.users,
					voteSession: voteSession,
					results: results,
					date: voteSession.createdAt,
				});
				await db.update("sessions", voteSession.id, {
					state: "voting",
					users: voteSession.users.map((user) => ({ ...user, vote: "X" })),
				});
				break;
			}
			case voteSession === undefined:
				break;
			default:
				break;
		}
	}

	async function handleVote(vote: VoteOptions) {
		if (selectedVote === vote) return;

		setSelectedVote(vote);

		try {
			await db.update("sessions", voteSession.id, {
				users: voteSession.users.map((user) =>
					user.id === currentUser.id ? { ...user, vote } : user,
				),
			});
		} catch (error) {
			console.error("❌ Error:", "table-content.tsx", error);
			toast.error("Failed to cast vote");
			setSelectedVote("X");
		}
	}

	return (
		<div className="grid h-full w-full grid-rows-4 place-items-center rounded-full border-6 border-gray-900 bg-gray-800 py-20 shadow-lg *:z-10">
			<div className="h-full w-[80%] place-content-center">
				<h1 className="text-center font-bold text-4xl text-gray-200">
					{sessionState === "idle" && "REFINATION"}
					{sessionState === "voting" && "Cast your vote!"}
					{sessionState === "results" && (
						<div className="flex justify-center gap-2">
							{results.votesCount.map(({ vote, count }) => (
								<div
									className="relative grid w-max place-items-center rounded-lg border border-sky-700 bg-sky-100 p-4 text-sky-700"
									key={vote}
								>
									<span className="font-bold text-2xl">{vote}</span>
									<span className="-left-2 -top-2 absolute grid aspect-square h-8 place-items-center rounded-full bg-sky-700 font-bold text-sky-100 text-sm">
										{count}
									</span>
								</div>
							))}
						</div>
					)}
				</h1>
			</div>
			<div className="row-span-2 flex h-full w-[95%] items-center justify-center gap-2">
				{sessionState === "voting" &&
					votes.map((vote) => (
						<button
							type="button"
							key={vote}
							className={cn("icon", selectedVote === vote ? "success" : "secondary")}
							onClick={() => handleVote(vote)}
						>
							{vote}
						</button>
					))}
				{sessionState === "results" && (
					<div className="flex gap-4">
						<span className="font-bold text-2xl">Avg: {results.average}</span>
						<span className="font-bold text-2xl">Agreement: {results.percentage}%</span>
					</div>
				)}
			</div>

			{currentUser.role === "manager" ? (
				<div className="mx-auto w-max">
					<button
						type="button"
						onClick={handleStateChange}
						className={
							sessionState === "results" || sessionState === "idle" ? "primary" : "success"
						}
					>
						{sessionState === "results" || sessionState === "idle"
							? "Start voting"
							: "Show results"}
					</button>
				</div>
			) : (
				<div className="mx-auto w-max">
					{sessionState === "idle" && (
						<p className="font-bold text-gray-200 text-lg">Waiting for manager to start</p>
					)}
				</div>
			)}
		</div>
	);
}
