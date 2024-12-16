import { BadgeCheckIcon, UsersIcon, ZapIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link } from "react-router";

export function LandingPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 ">
          Refine Tasks, Vote in Real-Time
        </h2>
        <p className="text-xl mb-8 text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
          Streamline your team's task refinement process with our intuitive, real-time voting app.
          Make decisions faster, together.
        </p>

        <div className="flex md:flex-col gap-8 md:gap-16 py-16 flex-col-reverse md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BadgeCheckIcon className="size-12 aspect-square text-success" />}
              title="Efficient Refinement"
              description="Quickly break down and estimate tasks with your team in real-time."
            />
            <FeatureCard
              icon={<UsersIcon className="size-12 aspect-square text-info" />}
              title="Team Collaboration"
              description="Foster better communication and alignment within your team."
            />
            <FeatureCard
              icon={<ZapIcon className="size-12 aspect-square text-warning" />}
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
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-12 bg-gradient-to-t from-indigo-600/10 to-indigo-400/10 rounded-2xl shadow-md transition-transform hover:scale-105">
      <div className="flex justify-center mb-6">{icon}</div>
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
          "button primary text-lg px-8 py-4 rounded-full font-semibold shadow-lg",
          "hover:spin-fast"
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
