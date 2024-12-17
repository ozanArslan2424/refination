import { Toaster } from "@/components/sonner";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Link, Outlet } from "react-router";

export function RootLayout() {
  const { user } = useAuth();
  return (
    <>
      <header className="flex items-center justify-between border-b px-16 py-4">
        <Link to="/">
          <h2>Refination</h2>
        </Link>
        <nav className="flex gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="button">
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  signOut(auth);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="button">
              Login
            </Link>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster richColors={true} />
    </>
  );
}
