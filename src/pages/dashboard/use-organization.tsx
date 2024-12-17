import { db } from "@/lib/db";
import { type Organization, orgSchema } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useOrganization(orgId: string | undefined) {
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		if (!orgId) return;

		const unsub = db.listen("organizations", orgId, {
			next: (doc) => {
				const organization = doc.data();
				const { data, error } = orgSchema.safeParse(organization);
				if (error) {
					toast.error("Organization not found");
					return;
				}
				setOrganization(data);
				setIsPending(false);
			},
			error: () => {
				toast.error("Failed to get organization");
				setIsPending(false);
			},
		});

		return () => unsub();
	}, [orgId]);

	return { organization, isPending };
}
