"use server";

import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "./auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;
// New Collection for iCal
const CALENDAR_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_EXTERNAL_CALENDAR_COLLECTION_ID;

if (!LISTINGS_COLLECTION_ID) {
  throw new Error("Listing Collection ID is missing.");
}

// --- FETCH USER PROPERTIES ---
export async function getUserProperties() {
  const user = await getLoggedInUser();
  if (!user) return [];

  const { databases } = await createSessionClient();

  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      [Query.equal("ownerId", user.$id), Query.orderDesc("$createdAt")]
    );
    return result.documents;
  } catch (error) {
    console.error("Fetch Properties Error:", error);
    return [];
  }
}

// --- DELETE PROPERTY ---
export async function deleteProperty(formData) {
  const propertyId = formData.get("propertyId");
  const { databases } = await createSessionClient();
  try {
    // 1. Delete Listing
    await databases.deleteDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      propertyId
    );

    // 2. Delete Associated Calendars (Cleanup)
    if (CALENDAR_COLLECTION_ID) {
      const calendars = await databases.listDocuments(
        DATABASE_ID,
        CALENDAR_COLLECTION_ID,
        [Query.equal("listingId", propertyId)]
      );
      await Promise.all(
        calendars.documents.map((doc) =>
          databases.deleteDocument(DATABASE_ID, CALENDAR_COLLECTION_ID, doc.$id)
        )
      );
    }

    revalidatePath("/properties");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Error", error);
    return { error: "Failed to delete" };
  }
}

// --- CREATE LISTING ---
export async function createListing(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };

  const { databases } = await createSessionClient();

  try {
    const imageIds = JSON.parse(formData.get("finalImageIds") || "[]");
    const icalUrls = JSON.parse(formData.get("icalUrls") || "[]"); // Get iCal URLs

    const listingData = {
      ownerId: user.$id,
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      latitude: parseFloat(formData.get("latitude") || 0),
      longitude: parseFloat(formData.get("longitude") || 0),
      maxGuests: parseInt(formData.get("maxGuests")),
      allowChildren: formData.get("allowChildren") === "true",
      maxInfants: parseInt(formData.get("maxInfants") || 0),
      maxPets: parseInt(formData.get("maxPets") || 0),
      amenities: formData.getAll("amenities"),
      addOns: formData.get("addOns") || "[]",
      imageIds: imageIds,
      thumbnail: imageIds.length > 0 ? imageIds[0] : null,
      weekdayOpen: formData.get("weekdayOpen"),
      weekdayClose: formData.get("weekdayClose"),
      weekendOpen: formData.get("weekendOpen"),
      weekendClose: formData.get("weekendClose"),
      bufferTime: parseInt(formData.get("bufferTime") || 0),
      weekendMultiplier: parseInt(formData.get("weekendMultiplier") || 0),
      price_3h: formData.get("price_3h")
        ? parseInt(formData.get("price_3h"))
        : null,
      price_6h: formData.get("price_6h")
        ? parseInt(formData.get("price_6h"))
        : null,
      price_12h: formData.get("price_12h")
        ? parseInt(formData.get("price_12h"))
        : null,
      price_24h: formData.get("price_24h")
        ? parseInt(formData.get("price_24h"))
        : null,
    };

    // 1. Create Listing Document
    const doc = await databases.createDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      ID.unique(),
      listingData
    );

    // 2. Create External Calendar Documents
    if (icalUrls.length > 0 && CALENDAR_COLLECTION_ID) {
      await Promise.all(
        icalUrls.map((url) =>
          databases.createDocument(
            DATABASE_ID,
            CALENDAR_COLLECTION_ID,
            ID.unique(),
            {
              listingId: doc.$id,
              url: url,
            }
          )
        )
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/properties");
    return { success: true, id: doc.$id };
  } catch (error) {
    console.error("Create Listing Error:", error);
    return { error: error.message };
  }
}

// --- UPDATE LISTING ---
export async function updateListing(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };

  const { databases } = await createSessionClient();
  const listingId = formData.get("listingId");

  try {
    const finalImageIds = JSON.parse(formData.get("finalImageIds") || "[]");
    const icalUrls = JSON.parse(formData.get("icalUrls") || "[]");

    const listingData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      latitude: parseFloat(formData.get("latitude") || 0),
      longitude: parseFloat(formData.get("longitude") || 0),
      maxGuests: parseInt(formData.get("maxGuests")),
      allowChildren: formData.get("allowChildren") === "true",
      maxInfants: parseInt(formData.get("maxInfants") || 0),
      maxPets: parseInt(formData.get("maxPets") || 0),
      amenities: formData.getAll("amenities"),
      addOns: formData.get("addOns") || "[]",
      imageIds: finalImageIds,
      thumbnail: finalImageIds.length > 0 ? finalImageIds[0] : null,
      weekdayOpen: formData.get("weekdayOpen"),
      weekdayClose: formData.get("weekdayClose"),
      weekendOpen: formData.get("weekendOpen"),
      weekendClose: formData.get("weekendClose"),
      bufferTime: parseInt(formData.get("bufferTime") || 0),
      weekendMultiplier: parseInt(formData.get("weekendMultiplier") || 0),
      price_3h: formData.get("price_3h")
        ? parseInt(formData.get("price_3h"))
        : null,
      price_6h: formData.get("price_6h")
        ? parseInt(formData.get("price_6h"))
        : null,
      price_12h: formData.get("price_12h")
        ? parseInt(formData.get("price_12h"))
        : null,
      price_24h: formData.get("price_24h")
        ? parseInt(formData.get("price_24h"))
        : null,
    };

    // 1. Update Listing Document
    await databases.updateDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      listingId,
      listingData
    );

    // 2. Handle iCal URLs (Delete existing, recreate new)
    if (CALENDAR_COLLECTION_ID) {
      // Fetch existing
      const existingCals = await databases.listDocuments(
        DATABASE_ID,
        CALENDAR_COLLECTION_ID,
        [Query.equal("listingId", listingId)]
      );

      // Delete all
      await Promise.all(
        existingCals.documents.map((doc) =>
          databases.deleteDocument(DATABASE_ID, CALENDAR_COLLECTION_ID, doc.$id)
        )
      );

      // Create new
      if (icalUrls.length > 0) {
        await Promise.all(
          icalUrls.map((url) =>
            databases.createDocument(
              DATABASE_ID,
              CALENDAR_COLLECTION_ID,
              ID.unique(),
              {
                listingId: listingId,
                url: url,
              }
            )
          )
        );
      }
    }

    revalidatePath("/properties");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Listing Error:", error);
    return { error: error.message };
  }
}

// --- GET LISTING BY ID (WITH iCALs) ---
export async function getListingById(id) {
  const { databases } = await createSessionClient();
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      id
    );

    // Fetch associated calendars
    let calendars = [];
    if (CALENDAR_COLLECTION_ID) {
      const calDocs = await databases.listDocuments(
        DATABASE_ID,
        CALENDAR_COLLECTION_ID,
        [Query.equal("listingId", id)]
      );
      calendars = calDocs.documents.map((c) => c.url);
    }

    return { ...doc, icalUrls: calendars };
  } catch (error) {
    console.error("Fetch Listing Error:", error);
    return null;
  }
}
