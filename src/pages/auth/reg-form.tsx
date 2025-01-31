import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { CreateProfileForm } from "./create-profile-form"
import { getErrorMessage } from "@/lib/utils"

export function RegisterForm() {
	const [step, setStep] = useState<"register" | "profile">("register")

	async function handleRegister(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const formValues = Object.fromEntries(formData.entries())

		const { data, error } = z
			.object({
				email: z.string({ message: "Email required" }).email("Invalid email"),
				password: z
					.string({ message: "Password required" })
					.min(6, "Password must be at least 6 characters long"),
			})
			.safeParse(formValues)

		if (error) {
			const errors = error.flatten().fieldErrors
			toast.error(errors.email)
			toast.error(errors.password)
			return
		}

		try {
			const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
			if (res.user) {
				toast.success("Account created successfully")
				setStep("profile")
			}
		} catch (error) {
			const message = getErrorMessage(error)
			toast.error(message)
		}
	}

	if (step === "profile") {
		if (!auth.currentUser) {
			return <p className="text-red-500">Not logged in</p>
		}

		return <CreateProfileForm authUser={auth.currentUser} />
	}

	return (
		<form onSubmit={handleRegister} className="p-4">
			<fieldset>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" />
			</fieldset>

			<fieldset>
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" />
			</fieldset>

			<button className="primary" type="submit">
				Register
			</button>
		</form>
	)
}
