import { db } from "@/lib/db";
import type {
	DatabaseUser,
	Organization,
	SessionUser,
	VoteSession,
	VoteSessionResult,
} from "@/lib/schemas";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { toast } from "sonner";

export async function fetchUser(userId: string) {
	const user = await db.get<DatabaseUser>("users", userId);

	if (!user) {
		throw new Error("User not found");
	}

	const organization = await db.get<Organization>("organizations", user.orgId);

	if (!organization) {
		throw new Error("Organization not found");
	}

	return { user, organization };
}

export function createUser(
	userId: string,
	userName: string,
	userEmail: string,
	userRole: "manager" | "user",
	userOrgId: string,
) {
	const databaseUser: DatabaseUser = {
		id: userId,
		name: userName,
		email: userEmail,
		role: userRole,
		orgId: userOrgId,
	};

	const sessionUser: SessionUser = {
		id: userId,
		name: userName,
		email: userEmail,
		orgId: userOrgId,
		role: userRole,
		vote: "X",
	};

	return { databaseUser, sessionUser };
}

export function createOrganization(name: string, manager: DatabaseUser): Organization {
	const newOrganization: Organization = {
		id: crypto.randomUUID(),
		name,
		manager: manager,
		users: [manager],
		sessionIds: [],
		activeSessionId: null,
	};

	return newOrganization;
}

export function createVoteSession(organization: Organization): VoteSession {
	const sessionManager: SessionUser = {
		...organization.manager,
		vote: "X",
	};

	const newVoteSession: VoteSession = {
		id: crypto.randomUUID(),
		orgId: organization.id,
		results: {
			aggreement: 0,
			average: 0,
			votes: [],
		},
		state: "idle",
		users: [sessionManager],
	};

	return newVoteSession;
}

export async function startVoting(voteSession: VoteSession) {
	const promise = db.update<Partial<VoteSession>>("sessions", voteSession.id, {
		state: "voting",
		results: {
			aggreement: 0,
			average: 0,
			votes: [],
		},
		users: voteSession.users.map((user) => ({
			...user,
			vote: "X",
		})),
	});

	await promise;

	toast.promise(promise, {
		loading: "Starting new vote...",
		success: "Started!",
		error: "Failed to start new vote",
	});
}

export async function startVotingAgain(
	voteSession: VoteSession,
	results: VoteSessionResult,
	orgId: string,
) {
	const resultedSessionId = crypto.randomUUID();
	const promise = Promise.all([
		// Save the results into a new session
		db.set<VoteSession>("sessions", resultedSessionId, {
			id: resultedSessionId,
			orgId: voteSession.orgId,
			results,
			state: "closed",
			users: voteSession.users,
		}),

		// Update the current session to no votes and state: "voting"
		db.update<Partial<VoteSession>>("sessions", voteSession.id, {
			state: "voting",
			results: {
				aggreement: 0,
				average: 0,
				votes: [],
			},
			users: voteSession.users.map((user) => ({
				...user,
				vote: "X",
			})),
		}),

		// Reference the resulted session in the organization
		db.update<Partial<Organization>>("organizations", orgId, {
			sessionIds: arrayUnion(resultedSessionId),
		}),
	]);

	await promise;

	toast.promise(promise, {
		loading: "Starting new vote...",
		success: "Started!",
		error: "Failed to start new vote",
	});
}

export async function closeSession(voteSession: VoteSession, organization: Organization) {
	const promise = Promise.all([
		db.update<Partial<VoteSession>>("sessions", voteSession.id, {
			state: "closed",
		}),

		db.update<Partial<Organization>>("organizations", organization.id, {
			activeSessionId: null,
		}),
	]);

	await promise;

	toast.promise(promise, {
		loading: "Closing session...",
		success: "Session closed",
		error: "Failed to close session",
	});
}

export async function leaveSession(voteSession: VoteSession, currentUser: SessionUser) {
	const promise = Promise.all([
		db.update("sessions", voteSession.id, {
			users: arrayRemove(currentUser),
		}),
	]);

	await promise;

	toast.promise(promise, {
		loading: "Leaving session...",
		success: "You've left the session",
		error: "Failed to leave session",
	});
}
