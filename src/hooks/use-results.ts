import { useMemo } from "react";
import type { VoteSession } from "@/lib/types";

export function useResults(users: VoteSession["users"]) {
	return useMemo(() => {
		const votedUsers = users.filter((user) => user.vote !== "X");

		const agreementRate = votedUsers.reduce(
			(acc, user) => {
				const voteValue = user.vote === "X" ? 0 : Number.parseInt(user.vote, 10);
				acc[voteValue] = (acc[voteValue] || 0) + 1;
				return acc;
			},
			{} as Record<number, number>,
		);

		const mostSelectedVote = Object.entries(agreementRate).reduce(
			(max, [vote, count]) =>
				count > max.count ? { vote: Number.parseInt(vote, 10), count } : max,
			{ vote: 0, count: 0 },
		);

		const totalVotes = votedUsers.reduce(
			(sum, user) => sum + (user.vote === "X" ? 0 : Number.parseInt(user.vote, 10)),
			0,
		);

		const arithmeticMean = Math.round(totalVotes / users.length);
		const predefinedValues = [0, 3, 5, 8, 13, 21];
		const average = predefinedValues.reduce((prev, curr) =>
			Math.abs(curr - arithmeticMean) < Math.abs(prev - arithmeticMean) ? curr : prev,
		);

		const percentage = Math.round((mostSelectedVote.count / users.length) * 100);

		const votesCount = Object.entries(agreementRate)
			.filter(([vote]) => vote !== "0")
			.map(([vote, count]) => ({ vote: Number.parseInt(vote, 10), count }));

		return {
			average,
			percentage,
			votesCount,
		};
	}, [users]);
}
