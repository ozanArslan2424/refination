import { useAuth } from "@/hooks/use-auth";
import { useProfileData } from "@/hooks/use-profile-data";
import { JoinSessionButton } from "@/pages/dashboard/join-session-button";
import { ChangeNameForm } from "./change-name-form";
import { ChangeOrganizationForm } from "./change-org-form";

export function DashboardPage() {
  console.count("🚀 Dashboard page rendered");

  const { user } = useAuth();
  const { profileData, isPending } = useProfileData(user?.uid);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!profileData) {
    return <p>Not logged in</p>;
  }

  return (
    <div className="container mx-auto space-y-6 px-16 py-8 lg:px-32">
      <h1>Welcome to Refination!</h1>
      <div className="grid grid-cols-1 gap-8 *:flex *:flex-col *:justify-between *:rounded-xl *:border *:p-8 sm:grid-cols-3">
        <JoinSessionButton profileData={profileData} />
        <ChangeOrganizationForm profileData={profileData} />
        <ChangeNameForm profileData={profileData} />
      </div>
    </div>
  );
}
