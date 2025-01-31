import { FieldValue } from "firebase/firestore"
import { z } from "zod"

const arrayUnionSchema = z
	.object({})
	.refine((x: object): x is FieldValue => x instanceof FieldValue)

const firebaseDate = z
	.object({
		nanoseconds: z.number(),
		seconds: z.number(),
	})
	.optional()

// ------------------------------

export const voteOptionsSchema = z.enum(["3", "5", "8", "13", "21", "X"])
export const sessionStateSchema = z.enum(["idle", "voting", "results", "closed"])

export const orgSchema = z.object({
	id: z.string(),
	name: z.string(),
	managerId: z.string(),
	activeSessionId: z.string(),
	sessionIds: z.union([z.array(z.string()), arrayUnionSchema]),
	userIds: z.union([z.array(z.string()), arrayUnionSchema]),
})

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
})

export const profileDataSchema = z.object({
	user: userSchema,
	organization: orgSchema,
})

export const sessionUserSchema = userSchema.extend({
	vote: voteOptionsSchema,
})

export const sessionResultSchema = z.object({
	average: z.number(),
	agreement: z.number(),
	votes: z.array(voteOptionsSchema),
	votesCount: z.array(
		z.object({
			vote: voteOptionsSchema,
			count: z.number(),
		}),
	),
})

export const sessionDocSchema = z.object({
	id: z.string().min(1, "Session ID must be at least 1 character"),
	state: sessionStateSchema,
	users: z.array(sessionUserSchema),
	createdAt: firebaseDate,
	results: sessionResultSchema,
})

export type VoteOptions = z.infer<typeof voteOptionsSchema>
export type VoteSession = z.infer<typeof sessionDocSchema>
export type VoteSessionResult = z.infer<typeof sessionResultSchema>

export type Organization = z.infer<typeof orgSchema>

export type DatabaseUser = z.infer<typeof userSchema>
export type ProfileData = z.infer<typeof profileDataSchema>
export type SessionUser = z.infer<typeof sessionUserSchema>
