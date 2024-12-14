import { useEffect, useState } from "react";
import { SessionUser, User } from "@/lib/types";
import { idb } from "@/lib/idb";
import { useSession } from "@/hooks/use-session";
import { useParams } from "react-router";
import { TableContent } from "@/components/table-content";
import { UserCircle } from "@/components/user-circle";
import { SessionControls } from "@/components/session-controls";

export function RefinementPage() {
  console.count("🚀 Refinement page rendered");

  const { sessionId } = useParams();

  const voteSession = useSession(sessionId!);

  const [sessionUser, setSessionUser] = useState<SessionUser>();

  useEffect(() => {
    idb.get<User>("user").then((user) => {
      voteSession?.users.map((u) => {
        if (u.id === user.id) {
          setSessionUser(u);
        }
      });
    });
  }, [voteSession]);

  if (!voteSession || !sessionUser) return;

  return (
    <>
      <SessionControls voteSession={voteSession} currentUser={sessionUser} />
      <div className="place-items-center pt-24">
        <div style={{ position: "relative", width: "480px", height: "480px" }}>
          <TableContent voteSession={voteSession} currentUser={sessionUser} />
          <UserCircle voteSession={voteSession} currentUser={sessionUser} />
        </div>
      </div>
    </>
  );
}
