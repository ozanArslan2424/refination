import { BadgeCheckIcon, UsersIcon, ZapIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link } from "react-router";

export function LandingPage() {
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
						<FeatureCard
							icon={<BadgeCheckIcon className="aspect-square size-12 text-success" />}
							title="Efficient Refinement"
							description="Quickly break down and estimate tasks with your team in real-time."
						/>
						<FeatureCard
							icon={<UsersIcon className="aspect-square size-12 text-info" />}
							title="Team Collaboration"
							description="Foster better communication and alignment within your team."
						/>
						<FeatureCard
							icon={<ZapIcon className="aspect-square size-12 text-warning" />}
							title="Instant Results"
							description="See voting results immediately and make informed decisions faster."
						/>
					</div>

					<div>
						<GetStartedLink />
					</div>
				</div>
			</div>

			<footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
				<p>&copy; 2024 Tabula Refination. All rights reserved.</p>
			</footer>
		</>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl bg-gradient-to-t from-indigo-600/10 to-indigo-400/10 px-6 py-12 shadow-md transition-transform hover:scale-105">
			<div className="mb-6 flex justify-center">{icon}</div>
			<h3 className="mb-3">{title}</h3>
			<p className="text-neutral-200">{description}</p>
		</div>
	);
}

function GetStartedLink() {
	const { user } = useAuth();

	const [showConfetti, setShowConfetti] = useState(false);

	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		setSize({ width: window.innerWidth, height: window.innerHeight });
	}, []);

	return (
		<div>
			<Link
				to={user ? "/dashboard" : "/auth"}
				className={cn(
					"button primary rounded-full px-8 py-4 font-semibold text-lg shadow-lg",
					"hover:spin-fast",
				)}
				onMouseEnter={() => setShowConfetti(true)}
				onMouseLeave={() => setShowConfetti(false)}
			>
				Get Started
			</Link>
			{showConfetti && (
				<Confetti
					numberOfPieces={800}
					run={showConfetti}
					initialVelocityY={20}
					initialVelocityX={20}
					recycle={true}
					gravity={0.5}
					{...size}
				/>
			)}
		</div>
	);
}
