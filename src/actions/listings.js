"use server";
import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createListing(formData) {
  // 1. Initialize Client
  const { account, databases, storage } = await createSessionClient();

  // 2. Verify User
  let user;
  try {
    user = await account.get();
  } catch (error) {
    return { error: "You must be logged in to create a listing." };
  }

  try {
    // 3. Extract Files
    // formData.getAll returns an array of File objects, just like formData.get returns one
    const files = formData.getAll("images");

    // 4. Upload Images to Storage
    const imageUploadPromises = files.map(async (file) => {
      return storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );
    });

    const uploadedFiles = await Promise.all(imageUploadPromises);
    const imageIds = uploadedFiles.map((file) => file.$id);
    const thumbnailId = imageIds.length > 0 ? imageIds[0] : null;

    // 5. Construct Database Object
    const dbPayload = {
      ownerId: user.$id,
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      maxGuests: parseInt(formData.get("maxGuests")),

      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      latitude: parseFloat(formData.get("latitude")),
      longitude: parseFloat(formData.get("longitude")),

      // Operations
      weekdayOpen: formData.get("weekdayOpen"),
      weekdayClose: formData.get("weekdayClose"),
      weekendOpen: formData.get("weekendOpen"),
      weekendClose: formData.get("weekendClose"),
      bufferTime: parseInt(formData.get("bufferTime")),

      // Pricing
      weekendMultiplier: parseInt(formData.get("weekendMultiplier") || "0"),
      price_1h: formData.get("price_1h")
        ? parseInt(formData.get("price_1h"))
        : null,
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

      // Arrays
      amenities: formData.getAll("amenities"),
      imageIds: imageIds,
      thumbnail: thumbnailId,
    };

    // 6. Save to Database
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID,
      ID.unique(),
      dbPayload
    );
  } catch (error) {
    console.error("Listing Creation Error:", error);
    return { error: `Failed to create listing: ${error.message}` };
  }

  // 7. Success
  revalidatePath("/mylistings");
  redirect("/mylistings");
}

export async function getUserListings(page = 1) {
  const { account, databases } = await createSessionClient();

  try {
    // 1. Get current user
    const user = await account.get();

    // 2. Pagination Math
    const PAGE_LIMIT = 9; // Show 9 cards per page
    const offset = (page - 1) * PAGE_LIMIT;

    // 3. Fetch Documents
    const result = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID,
      [
        Query.equal("ownerId", user.$id), // Only my listings
        Query.orderDesc("$createdAt"), // Newest first
        Query.limit(PAGE_LIMIT),
        Query.offset(offset),
      ]
    );

    return {
      listings: result.documents,
      total: result.total,
      limit: PAGE_LIMIT,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], total: 0, limit: 9 };
  }
}

export async function getListingById(listingId) {
  const { databases } = await createSessionClient();
  try {
    const listing = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID,
      listingId
    );
    return listing;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export async function deleteListing(listingId) {
  const { databases } = await createSessionClient();
  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID,
      listingId
    );
    revalidatePath("/mylistings");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}

export async function updateListing(formData) {
  const { account, databases, storage } = await createSessionClient();

  // 1. Verify User
  let user;
  try {
    user = await account.get();
  } catch (error) {
    return { error: "Unauthorized" };
  }

  const listingId = formData.get("listingId");
  const ownerId = formData.get("ownerId");

  // Security Check
  if (user.$id !== ownerId) {
    return { error: "You are not the owner of this listing" };
  }

  try {
    // 2. Handle Images

    // A. Get IDs of old images the user KEPT
    const keptImageIds = formData.getAll("keptImageIds");

    // B. Upload NEW images
    const newFiles = formData.getAll("newImages");
    const newImagePromises = newFiles.map(async (file) => {
      if (file.size === 0) return null; // Ignore empty inputs

      // Use the same direct upload logic that works in createListing
      return storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );
    });

    const newUploadedFiles = await Promise.all(newImagePromises);
    const newImageIds = newUploadedFiles
      .filter((f) => f !== null)
      .map((f) => f.$id);

    // C. Combine (Kept + New)
    const finalImageIds = [...keptImageIds, ...newImageIds];
    const thumbnailId = finalImageIds.length > 0 ? finalImageIds[0] : null;

    // 3. Prepare DB Payload
    const dbPayload = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      maxGuests: parseInt(formData.get("maxGuests")),

      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      latitude: parseFloat(formData.get("latitude")),
      longitude: parseFloat(formData.get("longitude")),

      weekdayOpen: formData.get("weekdayOpen"),
      weekdayClose: formData.get("weekdayClose"),
      weekendOpen: formData.get("weekendOpen"),
      weekendClose: formData.get("weekendClose"),
      bufferTime: parseInt(formData.get("bufferTime")),

      weekendMultiplier: parseInt(formData.get("weekendMultiplier") || "0"),
      price_1h: formData.get("price_1h")
        ? parseInt(formData.get("price_1h"))
        : null,
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

      amenities: formData.getAll("amenities"),
      imageIds: finalImageIds,
      thumbnail: thumbnailId,
    };

    // 4. Update Document
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID,
      listingId,
      dbPayload
    );
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update listing" };
  }

  revalidatePath(`/mylistings/${listingId}`);
  redirect(`/mylistings/${listingId}`);
}
