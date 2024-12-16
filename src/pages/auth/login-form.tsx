import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export function LoginForm() {
	const navigate = useNavigate();

	async function handleLogin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const formValues = Object.fromEntries(formData.entries());

		const { data, error } = z
			.object({
				email: z.string({ message: "Email required" }).email("Invalid email"),
				password: z
					.string({ message: "Password required" })
					.min(6, "Password must be at least 6 characters long"),
			})
			.safeParse(formValues);

		if (error) {
			const errors = error.flatten().fieldErrors;
			toast.error(errors.email);
			toast.error(errors.password);
			return;
		}

		const res = await signInWithEmailAndPassword(auth, data.email, data.password);

		if (res.user) {
			toast.success("Account created successfully");
			navigate("/dashboard");
		} else {
			toast.error("Failed to create account");
		}
	}

	return (
		<form onSubmit={handleLogin} className="p-4">
			<fieldset>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" />
			</fieldset>

			<fieldset>
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" />
			</fieldset>

			<button className="primary" type="submit">
				Login
			</button>
		</form>
	);
}
