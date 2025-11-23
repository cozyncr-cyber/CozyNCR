"use server";

import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

function getFileIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/files\/([^\/]+)\//);
  return match ? match[1] : null;
}

export async function uploadProfileImage(formData) {
  try {
    // 1. Verify User Session
    const { account } = await createSessionClient();
    const currentUser = await account.get(); // Throws if not logged in

    const formUserId = formData.get("userId");
    const file = formData.get("file");

    if (!file || !formUserId) throw new Error("Missing inputs");
    if (currentUser.$id !== formUserId) return { error: "Unauthorized" };

    // 2. Initialize Admin Client
    const { storage, databases } = await createAdminClient();

    // 3. Fetch current User Document (to check spam & get old file)
    const userDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      formUserId
    );

    // --- CONCERN 1: RATE LIMITING ---
    // Check if user uploaded in the last 60 seconds
    const ONE_MINUTE = 60 * 1000;
    const lastUpdate = userDoc.lastImageUpdate
      ? new Date(userDoc.lastImageUpdate).getTime()
      : 0;
    const now = Date.now();

    if (now - lastUpdate < ONE_MINUTE) {
      return {
        error: "Please wait a minute before updating your photo again.",
      };
    }

    // --- CONCERN 2: DELETE OLD FILE ---
    // If they have an existing avatar URL that belongs to Appwrite, delete it
    const oldFileId = getFileIdFromUrl(userDoc.avatarUrl);

    if (oldFileId) {
      try {
        await storage.deleteFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          oldFileId
        );
        console.log(`Deleted old file: ${oldFileId}`);
      } catch (deleteError) {
        // We ignore delete errors (e.g., file didn't exist) so we don't block the new upload
        console.warn("Could not delete old file:", deleteError.message);
      }
    }

    // 4. Upload New File
    const fileUpload = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );

    // 5. Construct New URL
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileUpload.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

    // 6. Update Database (URL + Timestamp for Rate Limit)
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      formUserId,
      {
        avatarUrl: fileUrl,
        lastImageUpdate: new Date().toISOString(), // Save current time
      }
    );

    revalidatePath("/profile");

    return { success: true, url: fileUrl };
  } catch (error) {
    console.error("Upload Logic Error:", error);
    return { error: error.message || "Failed to upload image" };
  }
}
