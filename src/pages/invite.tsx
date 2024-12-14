import { db } from "@/lib/db";
import { idb } from "@/lib/idb";
import { SessionUser, User } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export function InvitePage() {
  console.count("🚀 Invite page rendered");

  const { sessionId } = useParams();

  const navigate = useNavigate();

  const [foundUser, setFoundUser] = useState<User | undefined>();

  useEffect(() => {
    idb.get<User>("user").then((user) => {
      if (user) {
        setFoundUser(user);
      }
    });
  }, []);

  const [passwordRequired, setPasswordRequired] = useState(false);

  if (!sessionId) return <div>Invalid session ID</div>;

  async function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userEmail = formData.get("userEmail") as string;
    const userName = formData.get("userName") as string;

    const schema = z.object({
      userEmail: z.string().email(),
      userName: z.string().min(3),
    });

    if (passwordRequired) {
      const sessionPassword = formData.get("sessionPassword") as string;

      const schemaWithPassword = schema.extend({
        sessionPassword: z.string(),
      });

      return schemaWithPassword.safeParse({
        userEmail,
        userName,
        sessionPassword,
      });
    }

    const { data, error } = schema.safeParse({
      userEmail,
      userName,
    });

    if (error) {
      toast.error(error.message);
      console.error("❌ Parsing Error:", "invite.%24sessionId.tsx", error);
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.userEmail,
      name: data.userName,
      organization: {
        id: sessionId!,
        name: "Test",
      },
      role: "user",
    };

    const newSessionUser: SessionUser = {
      ...newUser,
      vote: "X",
    };

    try {
      await db.set("users", newUser.id, newUser);
      await idb.set("user", newUser);
      await db.update("sessions", sessionId!, {
        users: arrayUnion(newSessionUser),
      });
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      toast.success("Joined the table");
      await navigate(`/table/${sessionId}`);
    }
  }

  return (
    <div className="space-y-6 px-16 lg:px-32">
      <div className="flex items-start justify-center gap-12 pt-12">
        <div className="w-full space-y-2 lg:w-1/2">
          <h1>Welcome!</h1>
          <p>
            Create an account to join the table. I will never send you any
            emails.
          </p>
          <form onSubmit={handleJoin}>
            <fieldset>
              <label htmlFor="userEmail">Email</label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                defaultValue={foundUser ? foundUser.email : ""}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="userName">Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                defaultValue={foundUser ? foundUser.name : ""}
              />
            </fieldset>
            {passwordRequired && (
              <fieldset>
                <label htmlFor="sessionPassword">Session Password</label>
                <input
                  type="password"
                  id="sessionPassword"
                  name="sessionPassword"
                />
              </fieldset>
            )}
            <button className="primary w-full">Join Table</button>
          </form>
        </div>
      </div>
    </div>
  );
}
