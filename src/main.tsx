import "./styles.css";
import { router } from "@/router";
import reactDom from "react-dom/client";
import { RouterProvider } from "react-router";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element NOT found");
}

const root = reactDom.createRoot(rootElement);

root.render(<RouterProvider router={router} />);
