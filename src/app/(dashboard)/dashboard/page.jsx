import { getUserProfile } from "@/actions/auth";
import { getUserProperties, getOwnerBookingCount } from "@/actions/data";
import Link from "next/link";
import Image from "next/image";
import {
  BuildingStorefrontIcon,
  PlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";

// CRITICAL: Prevent static generation for auth-protected pages
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Parallel data fetching for performance
  const [user, properties, bookingCount] = await Promise.all([
    getUserProfile(),
    getUserProperties(),
    getOwnerBookingCount(),
  ]);

  // Determine status color/icon
  const isVerified = user?.kycStatus === "verified";
  const isPending = user?.kycStatus === "pending";

  // Get recent 3 properties
  const recentProperties = properties.slice(0, 3);

  // Achievement Logic
  const GOAL = 40;
  const progress = Math.min((bookingCount / GOAL) * 100, 100);
  const isGoalReached = bookingCount >= GOAL;

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here is what&apos;s happening with your listings today.
          </p>
        </div>
        <Link
          href="/properties/create"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Listing
        </Link>
      </div>

      {/* --- KYC STATUS BANNER (Conditional) --- */}
      {!isVerified && (
        <div
          className={`rounded-2xl p-6 border ${
            isPending
              ? "bg-yellow-50 border-yellow-100"
              : "bg-rose-50 border-rose-100"
          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
        >
          <div className="flex gap-4">
            <div
              className={`p-3 rounded-full shrink-0 ${
                isPending
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${
                  isPending ? "text-yellow-900" : "text-rose-900"
                }`}
              >
                {isPending
                  ? "Verification in Progress"
                  : "Account Verification Required"}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  isPending ? "text-yellow-700" : "text-rose-700"
                }`}
              >
                {isPending
                  ? "We are reviewing your documents. You will be able to publish listings once approved."
                  : "You need to verify your identity before your listings can go live."}
              </p>
            </div>
          </div>
          <Link
            href="/kyc"
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              isPending
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow-md"
            }`}
          >
            {isPending ? "Check Status" : "Verify Now"}
          </Link>
        </div>
      )}

      {/* --- OVERVIEW CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Listings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <BuildingStorefrontIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {properties.length}
            </h2>
            <span className="text-sm text-gray-500">Listings</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Account Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-lg ${
                isVerified
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2
              className={`text-3xl font-bold capitalize ${
                isVerified ? "text-green-600" : "text-gray-900"
              }`}
            >
              {user?.kycStatus || "Unverified"}
            </h2>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View Profile <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 3: Achievement / Goa Trip */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all ${
            isGoalReached
              ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-transparent"
              : "bg-white border-gray-100"
          }`}
        >
          {/* Background decoration for achieved state */}
          {isGoalReached && (
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-lg ${
                isGoalReached
                  ? "bg-white/20 text-white"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <GiftIcon className="h-6 w-6" />
            </div>
            {isGoalReached && (
              <span className="bg-white text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Unlocked!
              </span>
            )}
          </div>

          <div className="mb-3">
            <h2
              className={`text-lg font-bold leading-tight ${
                isGoalReached ? "text-white" : "text-gray-900"
              }`}
            >
              Free trip to Goa
            </h2>
            <p
              className={`text-sm mt-1 ${
                isGoalReached ? "text-indigo-100" : "text-gray-500"
              }`}
            >
              {isGoalReached
                ? "You've hit 40 bookings! Claim your reward now."
                : `Get ${GOAL} bookings to unlock a free trip.`}
            </p>
          </div>

          {isGoalReached ? (
            <div className="mt-4 pt-4 border-t border-white/20">
              <a
                href={`mailto:ncrcozy@gmail.com?subject=Claim Goa Trip Reward&body=Hi, I have reached ${bookingCount} bookings. User ID: ${user?.$id}`}
                className="block w-full text-center bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Claim Reward
              </a>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {bookingCount}
                  <span className="text-lg text-gray-400 font-normal">
                    /{GOAL}
                  </span>
                </span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- RECENT LISTINGS SECTION --- */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
          {properties.length > 0 && (
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              View All
            </Link>
          )}
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <Link
                key={property.$id}
                href={`/properties/${property.$id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {property.thumbnail ? (
                    <Image
                      src={`https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${property.thumbnail}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 uppercase z-10">
                    {property.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 truncate">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 mb-3">
                    <MapPinIcon className="h-3 w-3" />
                    <span className="truncate">
                      {property.city}, {property.state}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        3 Hours
                      </span>
                      <span className="font-semibold text-gray-900">
                        {property.price_3h ? `₹${property.price_3h}` : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Per Day
                      </span>
                      <span className="font-semibold text-gray-900">
                        {property.price_24h ? `₹${property.price_24h}` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No properties yet
            </h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-6">
              Ready to start hosting? Create your first listing now to reach
              potential guests.
            </p>
            <Link
              href="/properties/create"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Create First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
