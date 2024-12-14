import { Toaster } from "@/components/sonner";
import { ThemeProvider } from "next-themes";
import { Link, Outlet } from "react-router";

export function RootLayout() {
  return (
    <ThemeProvider attribute="class">
      <header className="flex items-center justify-between border-b px-16 py-4">
        <Link to="/">
          <h2>Refination</h2>
        </Link>
        <nav>
          <Link to="/settings">
            <button>Settings</button>
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster richColors />
    </ThemeProvider>
  );
}
