import { useEffect, useState } from "react";
import Confetti from "react-confetti";

import { useResults } from "@/pages/table/use-results";
import { useVoting } from "@/pages/table/use-voting";

import { db } from "@/lib/db";
import type { SessionUser, VoteOptions, VoteSession } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function TableContent({
  voteSession,
  currentUser,
}: {
  voteSession: VoteSession;
  currentUser: SessionUser;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  const { selectedVote, handleVote, startVoting, startVotingAgain, setSelectedVote } = useVoting(
    voteSession,
    currentUser
  );

  const results = useResults(voteSession.users);

  const sessionState = voteSession.state;
  const votes: VoteOptions[] = ["3", "5", "8", "13", "21", "X"];

  useEffect(() => {
    if (sessionState === "results") {
      setShowConfetti(true);
    } else if (sessionState === "voting") {
      setSelectedVote("X");
    }
  }, [sessionState]);

  async function handleStateChange() {
    switch (sessionState) {
      case "idle":
        await startVoting(voteSession);
        break;
      case "voting":
        await db.update("sessions", voteSession.id, { state: "results" });
        break;
      case "results":
        await startVotingAgain(
          voteSession,
          {
            aggreement: results.percentage,
            average: results.average,
            votes: results.votesCount.map(({ count }) => count),
          },
          currentUser.orgId
        );
        break;
      default:
        break;
    }
  }

  return (
    <div className="grid aspect-square h-full w-full min-w-[480px] grid-rows-4 place-items-center rounded-full border-6 border-gray-900 bg-gray-800 py-20 shadow-lg *:z-10">
      <div className="h-full w-[80%] place-content-center">
        <h1 className="text-center font-bold text-4xl text-gray-200">
          {sessionState === "idle" && "REFINATION"}
          {sessionState === "voting" && "Cast your vote!"}
          {sessionState === "results" && (
            <>
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
              {showConfetti && (
                <Confetti
                  numberOfPieces={10 * results.percentage}
                  run={showConfetti}
                  onConfettiComplete={() => {
                    setShowConfetti(false);
                  }}
                  initialVelocityY={20}
                  initialVelocityX={20}
                  recycle={false}
                  className="absolute inset-0"
                />
              )}
            </>
          )}
        </h1>
      </div>
      <div className="row-span-2 flex h-full w-[95%] items-center justify-center gap-2">
        {sessionState === "voting" && (
          <div className="flex items-center justify-center gap-2">
            {votes.map((vote) => (
              <button
                type="button"
                key={vote}
                className={cn("icon", selectedVote === vote ? "success" : "secondary")}
                onClick={() => handleVote(vote)}
              >
                {vote}
              </button>
            ))}
          </div>
        )}
        {sessionState === "results" && (
          <div className="flex gap-4">
            <span className="font-bold text-2xl">Avg: {results.average}</span>
            <span className="font-bold text-2xl">Agreement: {results.percentage}%</span>
          </div>
        )}
        {sessionState === "closed" && (
          <p className="font-bold text-gray-200 text-xl text-center">
            Session closed. <br />
            Goodbye.
          </p>
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
