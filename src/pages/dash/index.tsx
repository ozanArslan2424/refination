import { db } from "@/lib/db"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { VoteSession } from "@/lib/schemas"
import { UsernameForm } from "@/components/username-form"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"
import { arrayUnion } from "firebase/firestore"

export function DashboardPage() {
	const navigate = useNavigate()
	const [existingUser, setExistingUser] = useState<{ id: string; name: string } | null>(null)
	useEffect(() => {
		const userId = localStorage.getItem("userId") === "null" ? null : localStorage.getItem("userId")
		const userName =
			localStorage.getItem("username") === "null" ? null : localStorage.getItem("username")
		setExistingUser(userId && userName ? { id: userId, name: userName } : null)
	}, [])

	async function handleFinish(user: { id: string; name: string }) {
		const sessionId = crypto.randomUUID()

		await db.set<VoteSession>("sessions", sessionId, {
			id: sessionId,
			state: "idle",
			users: [{ ...user, vote: "X" }],
			results: {
				agreement: 0,
				average: 0,
				votes: [],
				votesCount: [],
			},
		})

		await navigate(`/table/${sessionId}`)
	}

	async function handleJoin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const name = formData.get("username") as string
		const sessionId = formData.get("sessionId") as string

		const userId = crypto.randomUUID()

		localStorage.setItem("userId", userId)
		localStorage.setItem("username", name)

		try {
			if (existingUser) {
				await db.update("users", existingUser.id, { name })
			} else {
				await db.set("users", userId, { id: userId, name })
			}

			await db.update("sessions", sessionId, {
				users: arrayUnion(
					existingUser ? { ...existingUser, vote: "X" } : { id: userId, name, vote: "X" },
				),
			})
		} catch (e) {
			const msg = getErrorMessage(e)
			toast.error(msg)
		}
	}

	return (
		<div className="container mx-auto space-y-6 px-16 py-8 lg:px-32">
			<h1>Welcome to Refination!</h1>
			<div className="flex items-center justify-center gap-4">
				<div className="card min-h-[280px] space-y-4 p-8">
					<h3>Create a new voting table</h3>
					<UsernameForm onFinish={handleFinish} existingUser={existingUser} />
				</div>
				<div className="card min-h-[280px] space-y-4 p-8">
					<h3>Join a voting table by ID</h3>
					<form onSubmit={handleJoin}>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Username"
							autoFocus
							defaultValue={existingUser?.name}
						/>
						<input id="sessionId" name="sessionId" type="text" placeholder="Table ID" />
						<button type="submit" className="w-full">
							Join
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
