import { useInitializeApp } from "@/hooks/use-initialize-app";
import { toReadableDate } from "@/lib/utils";
import { Link } from "react-router";

import { AccountFormSection } from "@/components/account-form-section";
import { FoundUserSection } from "@/components/found-user-section";

export function LandingPage() {
  console.count("🚀 Landing page rendered");

  const { activeSessionId, foundUser, foundSessions, isPending } =
    useInitializeApp();

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      {foundSessions && foundSessions.length > 1 && (
        <nav className="flex items-center gap-2 border-b px-16 py-4">
          <h3 className="pr-4">Existing Session: </h3>
          {foundSessions.map((session) => (
            <Link key={session.id} to={`/table/${session.id}`}>
              <button className="secondary">
                {toReadableDate(session.createdAt)} &#40;
                {session.state === "idle" ? "Not started" : "Active"}&#41;
              </button>
            </Link>
          ))}
        </nav>
      )}
      <div className="flex flex-col items-start justify-center gap-12 px-16 py-8 lg:flex-row lg:px-32">
        {foundUser && activeSessionId && (
          <FoundUserSection
            foundUser={foundUser}
            activeSessionId={activeSessionId}
          />
        )}
        <AccountFormSection foundUser={foundUser} />
      </div>
    </div>
  );
}
