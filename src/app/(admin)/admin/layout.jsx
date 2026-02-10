import Link from "next/link";
import { getUserProfile, logout } from "@/actions/auth";
import { redirect } from "next/navigation";
import {
  Squares2X2Icon,
  BanknotesIcon,
  IdentificationIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

// 👇 Needed for mobile toggle
import { useState } from "react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await getUserProfile();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: Squares2X2Icon },
    { name: "Host Payouts", href: "/admin/payouts", icon: BanknotesIcon },
    { name: "KYC Requests", href: "/admin/kyc", icon: IdentificationIcon },
    { name: "Refunds", href: "/admin/refunds", icon: ArrowPathIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src={"/cozncr_t.png"}
            height={400}
            width={1000}
            alt="Logo"
            className="h-12 w-24 object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Switch to Host View
          </Link>

          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
            {user.name?.charAt(0) || "A"}
          </div>
        </div>
      </nav>

      {/* --- Layout --- */}
      <div className="pt-16 flex min-h-screen overflow-hidden">
        {/* ✅ MOBILE MENU (same file client component) */}
        <MobileMenu navItems={navItems} />

        {/* --- Desktop Sidebar --- */}
        <aside className="hidden md:block w-64 flex-shrink-0 h-screen overflow-y-auto bg-white border-r border-gray-200 fixed left-0 top-16 pb-20">
          <div className="p-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-4">
              Menu
            </p>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-sm group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                {item.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-100">
              <form action={logout}>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm">
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 md:ml-64">
          <div className="max-w-5xl mx-auto pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* ============================= */
/* 📱 CLIENT MOBILE COMPONENT */
/* ============================= */

function MobileMenu({ navItems }) {
  "use client";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden w-full fixed top-16 left-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-gray-600">Menu</span>

        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-sm"
            >
              <item.icon className="w-5 h-5 text-gray-400" />
              {item.name}
            </Link>
          ))}

          <form action={logout}>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm">
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
