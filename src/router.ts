import { RootLayout } from "@/layout"
import { DashboardPage } from "@/pages/dash"
import { LandingPage } from "@/pages/landing"
import { TablePage } from "@/pages/table"

import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
	{
		Component: RootLayout,
		children: [
			{ path: "/", Component: LandingPage },
			{ path: "/dash", Component: DashboardPage },
			{ path: "/table/:sessionId", Component: TablePage },
		],
	},
])
