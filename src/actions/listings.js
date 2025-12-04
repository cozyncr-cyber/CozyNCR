"use server";

import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "./auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

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
    await databases.deleteDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      propertyId
    );
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

  const { databases, storage } = await createSessionClient();

  try {
    // 1. Upload New Images
    const files = formData.getAll("newImages");
    const newImageIds = [];

    if (files.length > 0) {
      const uploadPromises = files.map((file) =>
        storage.createFile(BUCKET_ID, ID.unique(), file)
      );
      const uploadedFiles = await Promise.all(uploadPromises);
      uploadedFiles.forEach((f) => newImageIds.push(f.$id));
    }

    // 2. Prepare Data
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

      // Guest Counts (Merged Adults & Children)
      maxGuests: parseInt(formData.get("maxGuests")),
      allowChildren: formData.get("allowChildren") === "true", // New Boolean
      maxInfants: parseInt(formData.get("maxInfants") || 0),
      maxPets: parseInt(formData.get("maxPets") || 0),

      amenities: formData.getAll("amenities"),

      // Add-ons (Services) stored as JSON string
      addOns: formData.get("addOns") || "[]",

      imageIds: newImageIds,
      thumbnail: newImageIds.length > 0 ? newImageIds[0] : null,

      weekdayOpen: formData.get("weekdayOpen"),
      weekdayClose: formData.get("weekdayClose"),
      weekendOpen: formData.get("weekendOpen"),
      weekendClose: formData.get("weekendClose"),
      bufferTime: parseInt(formData.get("bufferTime") || 0),
      weekendMultiplier: parseInt(formData.get("weekendMultiplier") || 0),

      // Removed price_1h
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

    const doc = await databases.createDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      ID.unique(),
      listingData
    );

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

  const { databases, storage } = await createSessionClient();
  const listingId = formData.get("listingId");

  try {
    // 1. Handle New Uploads
    const newFiles = formData.getAll("newImages");
    const newFileIds = [];

    if (newFiles.length > 0) {
      const uploadPromises = newFiles.map((file) =>
        storage.createFile(BUCKET_ID, ID.unique(), file)
      );
      const uploaded = await Promise.all(uploadPromises);
      uploaded.forEach((f) => newFileIds.push(f.$id));
    }

    // 2. Reconstruct Image Order
    const orderMap = JSON.parse(formData.get("finalImageOrder") || "[]");
    let finalImageIds = [];

    orderMap.forEach((item) => {
      if (item.startsWith("new_")) {
        const index = parseInt(item.split("_")[1]);
        if (newFileIds[index]) finalImageIds.push(newFileIds[index]);
      } else {
        finalImageIds.push(item);
      }
    });

    if (finalImageIds.length === 0 && newFileIds.length > 0) {
      finalImageIds = [...newFileIds];
    }

    const listingData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),

      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      latitude: parseFloat(formData.get("latitude") || 0),
      longitude: parseFloat(formData.get("longitude") || 0),

      // Guest Counts (Merged)
      maxGuests: parseInt(formData.get("maxGuests")),
      allowChildren: formData.get("allowChildren") === "true", // New Boolean
      maxInfants: parseInt(formData.get("maxInfants") || 0),
      maxPets: parseInt(formData.get("maxPets") || 0),

      amenities: formData.getAll("amenities"),

      // Add-ons
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

    await databases.updateDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      listingId,
      listingData
    );

    revalidatePath("/properties");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Listing Error:", error);
    return { error: error.message };
  }
}

export async function getListingById(id) {
  const { databases } = await createSessionClient();
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      id
    );
    return doc;
  } catch (error) {
    return null;
  }
}
