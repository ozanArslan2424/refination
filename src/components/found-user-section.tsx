import { CopyInput } from "@/components/copy-input";
import type { User } from "@/lib/types";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export function FoundUserSection({
	foundUser,
	activeSessionId,
}: {
	foundUser: User;
	activeSessionId: string;
}) {
	const navigate = useNavigate();

	const baseUrl = z.string().parse(import.meta.env.VITE_BASE_URL);

	function handleJoin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const invited = formData.get("invited") as string;

		if (invited.startsWith("http")) {
			const url = new URL(invited);

			const sessionId = url.pathname.split("/").pop();

			if (!sessionId) {
				toast.error("Invalid invite URL");
				return;
			}

			navigate(`/invite/${sessionId}`);
		} else {
			navigate(`/invite/${invited}`);
		}
	}

	return (
		<div className="w-max rounded-2xl border p-12">
			<div className="flex justify-between">
				<div>
					<h1>We found a match!</h1>
					<p className="pb-4 text-muted-foreground">You&apos;re already logged in as a manager.</p>

					<p>
						<strong>Your Name:</strong> {foundUser.name}
					</p>
					<p className="pt-2">
						<strong>Organization ID:</strong> {foundUser.organization.id}
					</p>
					<p className="pt-2">
						<strong>Organization Name:</strong> {foundUser.organization.name}
					</p>
				</div>
				<span className="text-6xl lg:text-9xl">📣</span>
			</div>

			{foundUser.role === "manager" ? (
				<div className="py-4">
					<fieldset>
						<label htmlFor="invite">Invite URL</label>
						<CopyInput copyId="invite" value={`${baseUrl}/invite/${activeSessionId}`} />
					</fieldset>

					<div className="pt-4">
						<Link to={`/table/${activeSessionId}`}>
							<button type="button" className="primary w-full">
								Create a vote session
							</button>
						</Link>
					</div>
				</div>
			) : (
				<form className="py-4" onSubmit={handleJoin}>
					<fieldset>
						<label htmlFor="invited" className="font-semibold">
							Enter your invite code or URL
						</label>
						<input id="invited" name="invited" type="text" />
					</fieldset>
					<button className="primary w-full" type="submit">
						Join your colleagues
					</button>
				</form>
			)}
		</div>
	);
}
