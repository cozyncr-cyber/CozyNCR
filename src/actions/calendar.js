"use server";

import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const BOOKINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID;

// Fetch bookings. If listingIds (array) is provided, fetch for those.
// If single string, fetch for that one.
export async function getBookings(listingIds) {
  const { databases } = await createSessionClient();
  try {
    if (!listingIds || listingIds.length === 0) return [];

    // Appwrite Query.equal accepts an array for "OR" logic
    const idsToCheck = Array.isArray(listingIds) ? listingIds : [listingIds];

    // Safety: Appwrite limits query length, but for <50 props this is fine
    const result = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [Query.equal("listingId", idsToCheck), Query.limit(100)]
    );
    return result.documents;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Generate Dummy Data for Testing
// Now accepts an ARRAY of listing IDs to distribute bookings randomly
export async function generateDummyBookings(listingIds) {
  const { databases } = await createSessionClient();

  if (!listingIds || listingIds.length === 0) return { error: "No listings" };

  const today = new Date();
  const names = ["Ankit", "Sarah", "Rahul", "Priya", "Mike", "Arjun", "Zara"];
  const services = ["Birthday", "Jam Session", "Shoot", "Party"];

  const bookings = [];

  // Create 8 random bookings
  for (let i = 0; i < 8; i++) {
    // 1. Pick Random Listing
    const randomListingId = Array.isArray(listingIds)
      ? listingIds[Math.floor(Math.random() * listingIds.length)]
      : listingIds;

    // 2. Random Day (Today/Tmrw)
    const randomDay = new Date(today);
    randomDay.setDate(today.getDate() + Math.floor(Math.random() * 2));

    // 3. Random Time (10am - 8pm)
    const startHour = 10 + Math.floor(Math.random() * 10);
    const duration = 1 + Math.floor(Math.random() * 2); // 1-2 hours

    const startTime = new Date(randomDay);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + duration, 0, 0, 0);

    bookings.push({
      listingId: randomListingId,
      customerName: names[Math.floor(Math.random() * names.length)],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: "confirmed",
      totalPrice: duration * 1000,
      serviceType: services[Math.floor(Math.random() * services.length)],
    });
  }

  try {
    await Promise.all(
      bookings.map((b) =>
        databases.createDocument(
          DATABASE_ID,
          BOOKINGS_COLLECTION_ID,
          ID.unique(),
          b
        )
      )
    );
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Dummy gen error:", error);
    return { error: "Failed to generate" };
  }
}
