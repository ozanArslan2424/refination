import type { ProfileData } from "@/lib/schemas";
import { useTableActions } from "@/pages/table/use-table-actions";

export function JoinSessionButton({
	activeSessionId,
	profileData,
}: {
	activeSessionId: string;
	profileData: ProfileData;
}) {
	const { handleNewTable, handleJoinTable } = useTableActions(profileData);

	if (activeSessionId !== "") {
		return (
			<button type="button" className="default" onClick={handleJoinTable}>
				<div className="animate-pulse rounded-lg border bg-primary p-4 text-center font-bold text-primary-foreground duration-[200] hover:animate-none">
					You have an active session! <br /> Click here to join.
				</div>
			</button>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<h2>You don&apos;t have an active session yet.</h2>
			<p>Click below to create a new table.</p>
			<button type="button" className="primary" onClick={handleNewTable}>
				Create New Table
			</button>
		</div>
	);
}
