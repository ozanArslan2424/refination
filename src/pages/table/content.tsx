import { useState } from "react"
import Confetti from "react-confetti"
import { useResults } from "@/pages/table/use-results"
import { db } from "@/lib/db"
import type { SessionUser, VoteOptions, VoteSession, VoteSessionResult } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function TableContent({
	voteSession,
	currentUser,
}: {
	voteSession: VoteSession
	currentUser: SessionUser
}) {
	const [showConfetti, setShowConfetti] = useState(false)
	const [selectedVote, setSelectedVote] = useState<VoteOptions>("X")
	const results = useResults(voteSession)

	async function handleVote(vote: VoteOptions) {
		if (selectedVote === vote) return

		setSelectedVote(vote)

		try {
			await db.runTransaction(async (transaction) => {
				const sessionRef = db.ref("sessions", voteSession.id)
				const sessionDoc = await transaction.get(sessionRef)
				if (!sessionDoc.exists()) {
					throw new Error("Session does not exist!")
				}
				const sessionData = sessionDoc.data() as VoteSession
				const updatedUsers = sessionData.users.map((user) =>
					user.id === currentUser.id ? { ...user, vote } : user,
				)
				transaction.update(sessionRef, { users: updatedUsers })
			})
		} catch {
			toast.error("Failed to cast vote")
			setSelectedVote("X")
		}
	}

	async function startVoting() {
		const promise = db.update<Partial<VoteSession>>("sessions", voteSession.id, {
			state: "voting",
			results: {
				agreement: 0,
				average: 0,
				votes: [],
				votesCount: [],
			},
			users: voteSession.users.map((user) => ({
				...user,
				vote: "X",
			})),
		})

		await promise

		toast.promise(promise, {
			loading: "Starting new vote...",
			success: "Started!",
			error: "Failed to start new vote",
		})
	}

	async function handleShowResults() {
		await db.update<Partial<VoteSession>>("sessions", voteSession.id, { state: "results" })
		setShowConfetti(true)

		const resultedSessionId = crypto.randomUUID()

		await db.set<VoteSession>("sessions", resultedSessionId, {
			id: resultedSessionId,
			results,
			state: "closed",
			users: voteSession.users,
		})
	}

	const votes: VoteOptions[] = ["3", "5", "8", "13", "21", "X"]

	if (voteSession.state === "idle") {
		return <IdleView startVoting={startVoting} />
	}

	if (voteSession.state === "voting") {
		return (
			<VotingView
				currentUser={currentUser}
				votes={votes}
				handleVote={handleVote}
				showResults={handleShowResults}
			/>
		)
	}

	if (voteSession.state === "results") {
		return (
			<ResultsView
				results={voteSession.results}
				showConfetti={showConfetti}
				stopConfetti={() => setShowConfetti(false)}
				startVotingAgain={startVoting}
			/>
		)
	}

	if (voteSession.state === "closed") {
		return <ClosedView />
	}

	return null
}

function ClosedView() {
	return (
		<div className="table-content">
			<div />
			<div className="table-content-middle">
				<p className="text-center text-xl font-bold text-gray-200">
					Session closed. <br /> Goodbye.
				</p>
			</div>
			<div />
		</div>
	)
}

function ResultsView({
	results,
	showConfetti,
	stopConfetti,
	startVotingAgain,
}: {
	results: VoteSessionResult
	showConfetti: boolean
	stopConfetti: () => void
	startVotingAgain: () => void
}) {
	return (
		<div className="table-content">
			<div className="table-content-top">
				<div className="flex justify-center gap-2">
					{results.votesCount.map(({ vote, count }) => (
						<div
							className="relative grid w-max place-items-center rounded-lg border border-sky-700 bg-sky-100 p-4 text-sky-700"
							key={vote}
						>
							<span className="text-2xl font-bold">{vote}</span>
							<span className="absolute -top-2 -left-2 grid aspect-square h-8 place-items-center rounded-full bg-sky-700 text-sm font-bold text-sky-100">
								{count}
							</span>
						</div>
					))}
				</div>
				{showConfetti && (
					<Confetti
						numberOfPieces={10 * results.agreement}
						run={showConfetti}
						onConfettiComplete={stopConfetti}
						initialVelocityY={20}
						initialVelocityX={20}
						recycle={false}
						className="absolute inset-0"
					/>
				)}
			</div>
			<div className="table-content-middle">
				<div className="flex gap-4">
					<span className="text-2xl font-bold">Avg: {results.average}</span>
					<span className="text-2xl font-bold">Agreement: {results.agreement}%</span>
				</div>
			</div>

			<div className="table-content-bottom">
				<button type="button" className="primary" onClick={startVotingAgain}>
					Start voting again
				</button>
			</div>
		</div>
	)
}

function VotingView({
	currentUser,
	votes,
	handleVote,
	showResults,
}: {
	currentUser: SessionUser
	votes: VoteOptions[]
	handleVote: (vote: VoteOptions) => void
	showResults: () => void
}) {
	return (
		<div className="table-content">
			<div className="table-content-top">
				<h1>Cast your vote!</h1>
			</div>
			<div className="table-content-middle">
				<div className="flex items-center justify-center gap-2">
					{votes.map((vote) => (
						<button
							type="button"
							key={vote}
							className={cn("icon", currentUser.vote === vote ? "success" : "secondary")}
							onClick={() => handleVote(vote)}
						>
							{vote}
						</button>
					))}
				</div>
			</div>

			<div className="table-content-bottom">
				<button type="button" onClick={showResults} className="success">
					Show results
				</button>
			</div>
		</div>
	)
}

function IdleView({ startVoting }: { startVoting: () => void }) {
	return (
		<div className="table-content">
			<div className="table-content-top">
				<h1>REFINATION</h1>
			</div>
			<div />
			<div className="table-content-bottom">
				<button type="button" onClick={startVoting} className="primary">
					Start voting
				</button>
			</div>
		</div>
	)
}
