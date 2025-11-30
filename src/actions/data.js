"use server";

import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "./auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;
const KYC_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_KYC_COLLECTION_ID; // New Variable
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// --- KYC ACTIONS ---

export async function submitKyc(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };

  const { databases, storage } = await createSessionClient();

  const aadharFile = formData.get("aadhar");
  const otherFile = formData.get("other");

  if (
    !aadharFile ||
    aadharFile.size === 0 ||
    !otherFile ||
    otherFile.size === 0
  ) {
    return { error: "Both documents are required." };
  }

  try {
    // 1. Upload Files in Parallel
    const [aadharUpload, otherUpload] = await Promise.all([
      storage.createFile(BUCKET_ID, ID.unique(), aadharFile),
      storage.createFile(BUCKET_ID, ID.unique(), otherFile),
    ]);

    // 2. Create KYC Request Record
    await databases.createDocument(
      DATABASE_ID,
      KYC_COLLECTION_ID,
      ID.unique(),
      {
        ownerId: user.$id,
        aadharFileId: aadharUpload.$id,
        otherFileId: otherUpload.$id,
        status: "pending",
      }
    );

    // 3. Update User Status to 'pending' so UI updates
    await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, user.$id, {
      kycStatus: "pending",
    });

    revalidatePath("/kyc");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("KYC Submission Error:", error);
    return { error: "Failed to submit documents. Please try again." };
  }
}

// --- EXISTING ACTIONS (Kept for context) ---

export async function updateUserProfile(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };
  const { databases, account } = await createSessionClient();
  const name = formData.get("name");
  const dob = formData.get("dob");
  const location = formData.get("location");

  try {
    if (name && name !== user.name) await account.updateName(name);
    await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, user.$id, {
      name,
      dob,
      location,
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}

export async function uploadAvatar(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };
  const { databases, storage } = await createSessionClient();
  const file = formData.get("avatar");
  if (!file || file.size === 0) return { error: "No file provided" };
  try {
    const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
    const avatarUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${fileUpload.$id}/view?project=${PROJECT_ID}`;
    await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, user.$id, {
      avatarUrl,
      lastImageUpdate: new Date().toISOString(),
    });
    revalidatePath("/profile");
    return { success: true, avatarUrl };
  } catch (error) {
    return { error: "Failed to upload avatar" };
  }
}

export async function createProperty(formData) {
  const user = await getLoggedInUser();
  if (!user) return { error: "Not authenticated" };
  const { databases, storage } = await createSessionClient();
  const imageFile = formData.get("thumbnail");
  let imageId = null;
  if (imageFile && imageFile.size > 0) {
    try {
      const fileUpload = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        imageFile
      );
      imageId = fileUpload.$id;
    } catch (e) {
      return { error: "Image upload failed" };
    }
  }
  const listingData = {
    ownerId: user.$id,
    title: formData.get("title"),
    description: formData.get("description"),
    address: formData.get("address"),
    amenities: [],
    imageIds: imageId ? [imageId] : [],
    thumbnail: imageId,
    maxGuests: parseInt(formData.get("maxGuests")),
    latitude: parseFloat(formData.get("latitude")),
    longitude: parseFloat(formData.get("longitude")),
    bufferTime: parseInt(formData.get("bufferTime")),
    weekendMultiplier: parseInt(formData.get("weekendMultiplier")),
    category: formData.get("category"),
    city: formData.get("city"),
    state: formData.get("state"),
    weekdayOpen: formData.get("weekdayOpen"),
    weekdayClose: formData.get("weekdayClose"),
    weekendOpen: formData.get("weekendOpen"),
    weekendClose: formData.get("weekendClose"),
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
  };
  try {
    await databases.createDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      ID.unique(),
      listingData
    );
  } catch (error) {
    return { error: error.message };
  }
  revalidatePath("/properties");
  redirect("/properties");
}

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
    return [];
  }
}

export async function deleteProperty(propertyId) {
  const { databases } = await createSessionClient();
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      LISTINGS_COLLECTION_ID,
      propertyId
    );
    revalidatePath("/properties");
  } catch (error) {}
}
