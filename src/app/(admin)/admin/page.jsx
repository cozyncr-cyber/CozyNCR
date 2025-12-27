import { getAdminStats } from "@/actions/admin";
import {
  UsersIcon,
  HomeModernIcon,
  CalendarDaysIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Listings",
      value: stats.totalListings,
      icon: HomeModernIcon,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDaysIcon,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending KYC",
      value: stats.pendingKyc,
      icon: ShieldExclamationIcon,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts or recent activity */}
      <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center py-20">
        <p className="text-gray-400">Activity charts coming soon...</p>
      </div>
    </div>
  );
}
