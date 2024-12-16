import { FieldValue } from "firebase/firestore";
import { z } from "zod";

const arrayUnionSchema = z
	.object({})
	.refine((x: object): x is FieldValue => x instanceof FieldValue);

const firebaseArray = (schema: z.ZodTypeAny) => z.union([z.array(schema), arrayUnionSchema]);

const firebaseDate = z
	.object({
		nanoseconds: z.number(),
		seconds: z.number(),
	})
	.optional();

export const voteOptionsSchema = z.enum(["3", "5", "8", "13", "21", "X"]);
export const sessionStateSchema = z.enum(["idle", "voting", "results", "closed"]);

export const userDocSchema = z.object({
	id: z.string(),
	name: z.string().min(3),
	email: z.string().email(),
	role: z.enum(["manager", "employee"]),
	orgId: z.string(),
	createdAt: firebaseDate,
});

export const organizationDocSchema = z.object({
	id: z.string(),
	name: z.string().min(3),
	manager: userDocSchema,
	users: z.array(userDocSchema),
	activeSessionId: z.string().uuid().nullable(),
	sessionIds: firebaseArray(z.string()),
	createdAt: firebaseDate,
});

export type VoteOptions = z.infer<typeof voteOptionsSchema>;

export type VoteSessionState = z.infer<typeof sessionStateSchema>;
export type VoteSessionResult = z.infer<typeof sessionResultSchema>;

export type SessionUser = z.infer<typeof sessionUserSchema>;

// ------------------------------

export const orgSchema = z.object({
	id: z.string(),
	name: z.string(),
	managerId: z.string(),
	activeSessionId: z.string(),
	sessionIds: firebaseArray(z.string()),
	userIds: firebaseArray(z.string()),
});

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	role: z.enum(["manager", "employee"]),
	orgId: z.string(),
});

export const profileDataSchema = z.object({
	user: userSchema,
	organization: orgSchema,
});

export const sessionUserSchema = userDocSchema.extend({
	vote: voteOptionsSchema,
});

export const sessionResultSchema = z.object({
	average: z.number(),
	aggreement: z.number(),
	votes: z.array(z.number()),
});

export const sessionDocSchema = z.object({
	id: z.string(),
	state: sessionStateSchema,
	users: z.array(sessionUserSchema),
	orgId: z.string(),
	createdAt: firebaseDate,
	results: sessionResultSchema,
});

export type VoteResult = z.infer<typeof sessionResultSchema>;
export type VoteSession = z.infer<typeof sessionDocSchema>;
export type Organization = z.infer<typeof orgSchema>;
export type DatabaseUser = z.infer<typeof userSchema>;
export type ProfileData = z.infer<typeof profileDataSchema>;
