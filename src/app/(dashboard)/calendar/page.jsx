import { getUserProperties } from "@/actions/listings";
import { getBookings } from "@/actions/calendar";
import CalendarView from "@/components/CalendarView";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CalendarPage() {
  const listings = await getUserProperties();

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Listings Found
        </h2>
        <p className="text-gray-500 mb-6">
          You need to create a property before you can view its calendar.
        </p>
        <Link
          href="/properties/create"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Create Listing
        </Link>
      </div>
    );
  }

  // Fetch ALL bookings for ALL user properties
  const allListingIds = listings.map((l) => l.$id);
  const initialBookings = await getBookings(allListingIds);

  return (
    <div className="h-full">
      <CalendarView listings={listings} initialBookings={initialBookings} />
    </div>
  );
}
