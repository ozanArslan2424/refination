import type { User } from "@/lib/types";
import type { FormEvent } from "react";

import { changeOrganization, createAccount, createSession } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export function AccountFormSection({ foundUser }: { foundUser: User | null }) {
	const navigate = useNavigate();

	async function handleCreateAccount(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const schema = z.object({
			orgName: z.string().min(3),
			userName: z.string(),
			userEmail: z.string().email(),
		});

		const { data, error } = schema.safeParse({
			orgName: formData.get("orgName"),
			userName: formData.get("userName"),
			userEmail: formData.get("userEmail"),
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		try {
			const newUser = foundUser
				? await changeOrganization(data.userEmail, data.userName, data.orgName, foundUser.id)
				: await createAccount(data.userEmail, data.userName, data.orgName);

			if (!newUser) throw new Error("Failed to create account");

			toast.success("Account created!");

			const newVoteSession = await createSession(newUser);

			if (!newVoteSession) throw new Error("Failed to create session");

			await navigate(`/table/${newVoteSession.id}`);
		} catch (error) {
			const message = getErrorMessage(error);
			toast.error(message);
		}
	}

	return (
		<div className="w-full space-y-2 lg:w-1/2">
			<h1>{foundUser ? "I have a new organization" : "I'm a manager."}</h1>
			<p>
				{foundUser
					? "Fill the form below to create a new organization and your first refinement table."
					: "Fill the form below to create an account and your first refinement table."}
			</p>
			<form className="pt-4" onSubmit={handleCreateAccount}>
				<fieldset>
					<label htmlFor="orgName">
						{foundUser && "New "}
						Organization Name
					</label>
					<input type="text" id="orgName" name="orgName" />
				</fieldset>

				<fieldset>
					<label htmlFor="userName">Name</label>
					<input
						type="text"
						id="userName"
						name="userName"
						defaultValue={foundUser ? foundUser.name : ""}
					/>
				</fieldset>

				<fieldset>
					<label htmlFor="userEmail">Email</label>
					<input
						type="email"
						id="userEmail"
						name="userEmail"
						defaultValue={foundUser ? foundUser.email : ""}
					/>
				</fieldset>

				<button type="submit" className="primary">
					{foundUser ? "Change Organization" : "Create Account"}
				</button>
			</form>
		</div>
	);
}
