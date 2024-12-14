import { createBrowserRouter } from "react-router";
import { LandingPage, SettingsPage, InvitePage, RefinementPage } from "./pages";
import { RootLayout } from "./layouts/root.layout";

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
