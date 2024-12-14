import type { z } from "zod";
import type {
	voteOptionsSchema,
	organizationSchema,
	sessionUserSchema,
	userSchema,
	voteSessionSchema,
	voteSessionStateSchema,
} from "./schemas";

export type VoteOptions = z.infer<typeof voteOptionsSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type User = z.infer<typeof userSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type VoteSessionState = z.infer<typeof voteSessionStateSchema>;
export type VoteSession = z.infer<typeof voteSessionSchema>;
