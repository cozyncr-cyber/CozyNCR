"use server";

import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const BOOKINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;

// --- HELPER: AUTO-REJECT OLD REQUESTS ---
async function expireOldRequests(databases, listingIds) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const expiredBookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("listingId", listingIds),
        Query.equal("status", "pending"),
        Query.lessThan("$createdAt", oneDayAgo),
        Query.limit(100),
      ]
    );

    if (expiredBookings.total > 0) {
      const updates = expiredBookings.documents.map((booking) =>
        databases.updateDocument(
          DATABASE_ID,
          BOOKINGS_COLLECTION_ID,
          booking.$id,
          { status: "rejected" }
        )
      );
      await Promise.all(updates);
    }
  } catch (error) {
    console.error("Auto-expire failed (non-critical):", error);
  }
}

// --- NEW: FETCH SIMPLE LISTING LIST FOR DROPDOWN ---
export async function getHostListingsSimple() {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const listings = await databases.listDocuments(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      [
        Query.equal("ownerId", user.$id),
        Query.select(["$id", "title"]), // Optimize fetch
        Query.limit(100),
      ]
    );
    return listings.documents;
  } catch (error) {
    return [];
  }
}

// --- NEW: CREATE MANUAL BLOCK ---
export async function createManualBlock(formData) {
  const listingId = formData.get("listingId");
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");

  if (!listingId || !startTime || !endTime) {
    return { error: "All fields are required" };
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return { error: "End time must be after start time" };
  }

  try {
    const { databases } = await createSessionClient();

    // Check for overlaps with Active Bookings (Confirmed, Pending, or Blocked)
    // We assume anything NOT cancelled/rejected is blocking the calendar
    const conflicts = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("listingId", listingId),
        // "IN" query: Check against status that occupy the slot
        Query.equal("status", ["confirmed", "pending", "blocked"]),
        Query.lessThan("startTime", endTime),
        Query.greaterThan("endTime", startTime),
        Query.limit(1),
      ]
    );

    if (conflicts.total > 0) {
      return {
        error: "Selected dates overlap with an existing booking or block.",
      };
    }

    // Create the Block
    await databases.createDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      ID.unique(),
      {
        listingId,
        customerName: "Host Blocked", // Indicator for UI
        startTime,
        endTime,
        status: "blocked",
        totalPrice: 0,
        guestCount: 1,
      }
    );

    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    console.error("Block Date Error:", error);
    return { error: error.message || "Failed to block dates" };
  }
}

export async function getHostBookings(page = 1, limit = 10) {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const hostListings = await databases.listDocuments(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      [Query.equal("ownerId", user.$id)]
    );

    if (hostListings.total === 0) return { documents: [], total: 0 };

    const listingIds = hostListings.documents.map((listing) => listing.$id);

    await expireOldRequests(databases, listingIds);

    const offset = (page - 1) * limit;

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
