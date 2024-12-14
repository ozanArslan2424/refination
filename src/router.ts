import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/root.layout";
import { LandingPage } from "@/pages/landing";
import { SettingsPage } from "@/pages/settings";
import { InvitePage } from "@/pages/invite";
import { RefinementPage } from "@/pages/table";

export const router = createBrowserRouter([
	{
		Component: RootLayout,
		children: [
			{ path: "/", Component: LandingPage },
			{ path: "/settings", Component: SettingsPage },
			{ path: "/invite/:sessionId", Component: InvitePage },
			{ path: "/table/:sessionId", Component: RefinementPage },
		],
	},
]);
