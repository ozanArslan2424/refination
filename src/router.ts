import { RootLayout } from "@/layout";
import { AuthPage } from "@/pages/auth";
import { DashboardPage } from "@/pages/dashboard";
import { LandingPage } from "@/pages/landing";
import { TablePage } from "@/pages/table";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		Component: RootLayout,
		children: [
			{ path: "/", Component: LandingPage },
			{ path: "/auth", Component: AuthPage },
			{ path: "/dashboard", Component: DashboardPage },
			{ path: "/table/:sessionId", Component: TablePage },
		],
	},
]);
