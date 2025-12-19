"use server";

import { Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const BOOKINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;

export async function getHostBookings(page = 1, limit = 10) {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    // 1. Get all listings owned by this user
    const hostListings = await databases.listDocuments(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      [Query.equal("ownerId", user.$id)]
    );

    if (hostListings.total === 0) return { documents: [], total: 0 };

    const listingIds = hostListings.documents.map((listing) => listing.$id);
    const offset = (page - 1) * limit;

    // 2. Get paginated bookings for those listings
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("listingId", listingIds),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const enrichedBookings = bookings.documents.map((booking) => {
      const listing = hostListings.documents.find(
        (l) => l.$id === booking.listingId
      );
      return {
        ...booking,
        listingTitle: listing?.title || "Unknown Listing",
      };
    });

    return {
      documents: enrichedBookings,
      total: bookings.total,
    };
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    return { documents: [], total: 0 };
  }
}

export async function updateBookingStatus(bookingId, status) {
  try {
    const { databases } = await createSessionClient();

    await databases.updateDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      bookingId,
      { status }
    );

    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { error: error.message || "Failed to update status" };
  }
}
