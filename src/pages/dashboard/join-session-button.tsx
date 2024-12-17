import type { ProfileData } from "@/lib/schemas";
import { useTableActions } from "@/pages/table/use-table-actions";
import { useOrganization } from "./use-organization";

export function JoinSessionButton({ profileData }: { profileData: ProfileData }) {
  const { handleNewTable, handleJoinTable } = useTableActions(profileData);
  const { organization } = useOrganization(profileData.user.orgId);

  if (organization && organization.activeSessionId !== "") {
    return (
      <div>
        <div>
          <h3>You have an active session!</h3>
          <p className="pb-4 font-medium text-muted-foreground">
            {new Array(organization.userIds).length} users are waiting.
          </p>
        </div>
        <button
          type="button"
          className="primary animate-pulse p-4 font-bold hover:animate-none"
          onClick={handleJoinTable}
        >
          Click here to join.
        </button>
      </div>
    );
  }

  if (profileData.user.role === "manager") {
    return (
      <div>
        <div>
          <h3>You don&apos;t have an active session yet.</h3>
          <p className="pb-4 font-medium text-muted-foreground">
            Create a new table to start a session.
          </p>
        </div>
        <button type="button" className="primary" onClick={handleNewTable}>
          Create New Table
        </button>
      </div>
    );
  }

  return null;
}
