import { createSession, findUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { User, VoteSession } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { useEffect, useReducer, useTransition } from "react";
import { toast } from "sonner";

type State = {
  foundUser: User | null;
  activeSessionId: string | null;
  foundSessions: VoteSession[] | null;
};

type Action =
  | {
      type: "SET_FOUND_USER";
      payload: User | null;
    }
  | {
      type: "SET_ACTIVE_SESSION_ID";
      payload: string | null;
    }
  | {
      type: "SET_FOUND_SESSIONS";
      payload: VoteSession[] | null;
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_FOUND_USER":
      return { ...state, foundUser: action.payload };
    case "SET_ACTIVE_SESSION_ID":
      return { ...state, activeSessionId: action.payload };
    case "SET_FOUND_SESSIONS":
      return { ...state, foundSessions: action.payload };
    default:
      return state;
  }
}

const initialState = {
  foundUser: null,
  activeSessionId: null,
  foundSessions: null,
};

export function useInitializeApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  async function findUserAndCreateSession() {
    const userData = await findUser();
    if (!userData) return;

    console.log("🔍 Found user", userData);

    dispatch({ type: "SET_FOUND_USER", payload: userData });

    try {
      const existingSessions = await db.findMany<VoteSession>(
        "sessions",
        db.filters.eq("organizationId", "==", userData.organization.id),
        5
      );

      if (existingSessions) {
        console.log("🔍 Found existing sessions", existingSessions);

        dispatch({ type: "SET_FOUND_SESSIONS", payload: existingSessions });
        dispatch({
          type: "SET_ACTIVE_SESSION_ID",
          payload: existingSessions[0].id,
        });

        return;
      }

      console.log("🔧 Creating new session");

      const newVoteSession = await createSession(userData);
      if (!newVoteSession) throw new Error("Failed to create session");

      console.log("🟢 Created new session", newVoteSession);

      dispatch({ type: "SET_ACTIVE_SESSION_ID", payload: newVoteSession.id });
    } catch (error) {
      console.error("🚨 Error creating session");
      const message = getErrorMessage(error);
      toast.error(message);
    }
  }

  useEffect(() => {
    startTransition(() => {
      console.log("🏁 Started initialization");
      findUserAndCreateSession();
    });
  }, []);

  return { ...state, isPending };
}
