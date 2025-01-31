import { cn } from "@/lib/utils"
import { LoginForm } from "@/pages/auth/login-form"
import { RegisterForm } from "@/pages/auth/reg-form"
import { useState } from "react"

export function AuthPage() {
	const [tab, setTab] = useState<"register" | "login">("login")

	return (
		<div className="flex flex-col items-start justify-center gap-12 px-16 py-8 lg:flex-row lg:px-32">
			<div className="w-full space-y-4 lg:w-[50%]">
				<h1>Welcome to Refination!</h1>
				<h3>You need to be logged in before joining or creating organization.</h3>

				<div className="flex w-full py-2">
					<button
						type="button"
						className={cn("w-[50%] rounded-r-none", tab === "login" && "primary")}
						onClick={() => setTab("login")}
					>
						Login
					</button>

					<button
						type="button"
						className={cn("w-[50%] rounded-l-none", tab === "register" && "primary")}
						onClick={() => setTab("register")}
					>
						Register
					</button>
				</div>

				{tab === "login" ? <LoginForm /> : <RegisterForm />}
			</div>
		</div>
	)
}
