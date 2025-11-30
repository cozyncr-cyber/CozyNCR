import { getLoggedInUser, getUserProfile } from "@/actions/auth";
import KycForm from "@/components/KycForm";
import { redirect } from "next/navigation";

export default async function KycPage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          KYC Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Complete your profile verification to start hosting.
        </p>
      </div>

      <KycForm user={user} />
    </div>
  );
}
