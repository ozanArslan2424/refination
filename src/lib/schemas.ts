import { z } from "zod";

export const voteOptionsSchema = z.enum(["3", "5", "8", "13", "21", "X"]);

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  organization: organizationSchema,
  role: z.enum(["manager", "user"]),
  oldId: z.string().uuid().optional(),
});

export const sessionUserSchema = userSchema.extend({
  vote: voteOptionsSchema,
});

export const voteSessionStateSchema = z.enum(["idle", "voting", "results"]);

export const voteSessionSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdAt: z.string().transform((value) => new Date(value).toISOString()),
  state: voteSessionStateSchema,
  users: z.array(sessionUserSchema),
});
