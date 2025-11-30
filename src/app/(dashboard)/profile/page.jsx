import { getUserProfile } from "@/actions/auth";
import ProfileForm from "@/components/ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
