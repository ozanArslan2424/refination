import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router";

export function LandingPage() {
	console.count("🚀 Landing page rendered");

	const { user } = useAuth();

	return (
		<>
			<div className="flex flex-col items-start justify-center gap-12 px-16 py-8 lg:flex-row lg:px-32">
				<div className="w-full space-y-4 lg:w-1/3">
					<h1>Welcome to Refination!</h1>
					<h2>This is the landing page.</h2>

					{!user && (
						<div className="space-y-4">
							<h3>You need to be logged in before joining or creating organization.</h3>
							<div className="flex gap-4">
								<Link to="/auth" className="primary button">
									Login or Register
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
