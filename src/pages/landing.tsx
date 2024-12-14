import { useInitializeApp } from "@/hooks/use-initialize-app";

import { AccountFormSection } from "@/components/account-form-section";
import { FoundUserSection } from "@/components/found-user-section";

export function LandingPage() {
	console.count("🚀 Landing page rendered");

	const { activeSessionId, foundUser, isPending } = useInitializeApp();

	if (isPending) return <div>Loading...</div>;

	return (
		<>
			<div className="flex flex-col items-start justify-center gap-12 px-16 py-8 lg:flex-row lg:px-32">
				{foundUser && activeSessionId && (
					<FoundUserSection foundUser={foundUser} activeSessionId={activeSessionId} />
				)}
				<AccountFormSection foundUser={foundUser} />
			</div>

			<div className="flex *:grid *:size-20 *:place-content-center *:font-black *:text-6xl">
				<div className="bg-background text-foreground">X</div>
				<div className="bg-primary text-primary-foreground">X</div>
				<div className="bg-secondary text-secondary-foreground">X</div>
				<div className="bg-info text-info-foreground">X</div>
				<div className="bg-warning text-warning-foreground">X</div>
				<div className="bg-success text-success-foreground">X</div>
				<div className="bg-muted text-muted-foreground">X</div>
			</div>
		</>
	);
}
