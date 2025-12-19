"use server";

import { Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const BOOKINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;
/**
 * Fetches bookings for a specific date range for the host's listings
 */
export async function getCalendarData(rangeStart, rangeEnd) {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    // 1. Get host's listings
    const hostListings = await databases.listDocuments(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      [Query.equal("ownerId", user.$id)]
    );

    if (hostListings.total === 0) return { bookings: [], listings: [] };

    const listingIds = hostListings.documents.map((l) => l.$id);

    // 2. Fetch bookings within the range for these listings
    // We query for bookings where startTime is before rangeEnd AND endTime is after rangeStart
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("listingId", listingIds),
        Query.greaterThanEqual("endTime", rangeStart),
        Query.lessThanEqual("startTime", rangeEnd),
      ]
    );

    const enrichedBookings = bookings.documents.map((booking) => {
      const listing = hostListings.documents.find(
        (l) => l.$id === booking.listingId
      );
      return {
        ...booking,
        listingTitle: listing?.title || "Unknown",
        color: stringToColor(booking.listingId), // Consistent color per property
      };
    });

    return {
      bookings: enrichedBookings,
      listings: hostListings.documents,
    };
  } catch (error) {
    console.error("Calendar Data Error:", error);
    return { bookings: [], listings: [] };
  }
}

// Helper to generate consistent colors for properties
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}
