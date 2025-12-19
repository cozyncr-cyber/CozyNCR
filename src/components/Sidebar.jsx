"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { BookAIcon, BookImageIcon, CreditCard } from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { name: "My Listings", href: "/properties", icon: BuildingStorefrontIcon },
  { name: "Bookings", href: "/bookings", icon: BookAIcon },
  { name: "Calendar", href: "/calendar", icon: CalendarDaysIcon },
  { name: "Profile", href: "/profile", icon: UserCircleIcon },
  {
    name: "Payment Preferences",
    href: "/payment-preferences",
    icon: CreditCard,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const isVerified = user?.kycStatus === "verified";
  const isPending = user?.kycStatus === "pending";

  return (
    <div className="flex h-full w-full flex-col bg-white border-r border-gray-100">
      <nav className="flex-1 flex flex-col px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out mb-1"
              )}
            >
              <item.icon
                className={classNames(
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600",
                  "mr-3 h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}

        <Link
          href="/kyc"
          className={classNames(
            pathname.startsWith("/kyc")
              ? "bg-gray-900 text-white shadow-sm"
              : isVerified
              ? "text-green-600 hover:bg-green-50"
              : "text-rose-600 hover:bg-rose-50",
            "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out mb-1 mt-4"
          )}
        >
          {isVerified ? (
            <ShieldCheckIcon className="mr-3 h-5 w-5 flex-shrink-0" />
          ) : (
            <ExclamationTriangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
          )}
          Verification
          {!isVerified && (
            <span className="ml-auto bg-rose-100 text-rose-800 py-0.5 px-2 rounded-full text-xs font-bold">
              {isPending ? "Pending" : "Required"}
            </span>
          )}
        </Link>
      </nav>

      {/* Mini Profile Info */}
      <div className="p-4 mt-auto border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
