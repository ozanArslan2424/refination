import { db } from "@/lib/db";
import { idb } from "@/lib/idb";
import { User, VoteSession } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export async function createSession(user: User) {
	const newVoteSession: VoteSession = {
		id: crypto.randomUUID(),
		organizationId: user.organization.id,
		createdAt: new Date().toISOString(),
		state: "idle",
		users: [{ ...user, vote: "X" }],
	};

	try {
		await db.set("sessions", newVoteSession.id, newVoteSession);
	} catch (error) {
		const message = getErrorMessage(error);
		toast.error(message);
		return null;
	} finally {
		return newVoteSession;
	}
}

export async function createAccount(userEmail: string, userName: string, orgName: string) {
	const existingUser = await db.findFirst<User>("users", db.filters.eq("email", "==", userEmail));

	if (existingUser) {
		toast.warning("User already exists");
		return existingUser;
	}

	const newUser: User = {
		id: crypto.randomUUID(),
		email: userEmail,
		name: userName,
		organization: {
			id: crypto.randomUUID(),
			name: orgName,
		},
		role: "manager",
	};

	try {
		await db.set("users", newUser.id, newUser);
		await idb.set<User>("user", newUser);
	} catch (error) {
		const message = getErrorMessage(error);
		toast.error(message);
		return null;
	} finally {
		return newUser;
	}
}

export async function changeOrganization(
	userEmail: string,
	userName: string,
	orgName: string,
	oldId: string,
) {
	const updatedUser: User = {
		id: crypto.randomUUID(),
		email: userEmail,
		name: userName,
		organization: {
			id: crypto.randomUUID(),
			name: orgName,
		},
		role: "manager",
		oldId: oldId,
	};

	try {
		await db.set("users", updatedUser.id, updatedUser);
		await idb.set<User>("user", updatedUser);
	} catch (error) {
		const message = getErrorMessage(error);
		toast.error(message);
		return null;
	} finally {
		return updatedUser;
	}
}

export async function findUser() {
	const user = await idb.get<User>("user");
	if (!user) return null;
	const userData = await db.get<User>("users", user.id);
	return userData;
}
