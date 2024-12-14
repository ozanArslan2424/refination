import { RootLayout } from "@/layouts/root.layout";
import { InvitePage } from "@/pages/invite";
import { LandingPage } from "@/pages/landing";
import { SettingsPage } from "@/pages/settings";
import { RefinementPage } from "@/pages/table";
import { createBrowserRouter } from "react-router";

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
