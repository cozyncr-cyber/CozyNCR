import { getLoggedInUser } from "@/actions/auth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="-mt-20 min-h-screen bg-[#F9FAFB]">
      {/* 1. Global Navbar (Fixed Top, h-16) */}
      <Navbar user={user} />

      {/* 2. Layout Container (starts after navbar) */}
      <div className="pt-16 flex h-screen overflow-hidden">
        {/* Sidebar (Fixed Left, Hidden on Mobile) */}
        <div className="hidden md:block w-64 flex-shrink-0 h-full overflow-y-auto">
          <Sidebar user={user} />
        </div>

        {/* Main Content (Scrollable) */}
        <main className="flex-1 h-full overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
