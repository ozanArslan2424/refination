import { BadgeCheckIcon, UsersIcon, ZapIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export function LandingPage() {
  const { user } = useAuth();

  return (
    <>
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-6 font-extrabold text-4xl md:text-5xl ">
          Refine Tasks, Vote in Real-Time
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl dark:text-gray-300">
          Streamline your team's task refinement process with our intuitive, real-time voting app.
          Make decisions faster, together.
        </p>

        <div className="flex flex-col-reverse gap-8 py-16 md:flex-col md:gap-16 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-t from-indigo-600/10 to-indigo-400/10 px-6 py-12 shadow-md">
              <div className="mb-6 flex justify-center">
                <BadgeCheckIcon className="aspect-square size-12 text-success" />
              </div>
              <h3 className="mb-3">Efficient Refinement</h3>
              <p className="text-neutral-200">
                Quickly break down and estimate tasks with your team in real-time.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-t from-indigo-600/10 to-indigo-400/10 px-6 py-12 shadow-md">
              <div className="mb-6 flex justify-center">
                <UsersIcon className="aspect-square size-12 text-info" />
              </div>
              <h3 className="mb-3">Team Collaboration</h3>
              <p className="text-neutral-200">
                Foster better communication and alignment within your team.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-t from-indigo-600/10 to-indigo-400/10 px-6 py-12 shadow-md">
              <div className="mb-6 flex justify-center">
                <ZapIcon className="aspect-square size-12 text-warning" />
              </div>
              <h3 className="mb-3">Instant Results</h3>
              <p className="text-neutral-200">
                See voting results immediately and make informed decisions faster.
              </p>
            </div>
          </div>

          <div>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className={cn(
                "button primary rounded-full px-8 py-4 font-semibold text-lg shadow-lg",
                "hover:disco-animation"
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>
          This is <strong>Refination</strong> by <a href="https://ozanarslan.vercel.app">Tabula</a>.
        </p>
        <p>
          Designed and developed by <a href="https://ozanarslan.vercel.app">Ozan Arslan</a>.
        </p>
      </footer>
    </>
  );
}
