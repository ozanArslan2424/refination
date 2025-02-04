import { Toaster } from "@/components/sonner"
import { Link, Outlet } from "react-router"

export function RootLayout() {
	return (
		<>
			<header className="flex items-center justify-between border-b px-16 py-4">
				<Link to="/">
					<h2>Refination</h2>
				</Link>
				<nav className="flex gap-2">
					<Link to="/dash" className="button">
						Dashboard
					</Link>
				</nav>
			</header>
			<main>
				<Outlet />
			</main>
			<Toaster richColors={true} />
		</>
	)
}
