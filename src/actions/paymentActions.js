"use server";

import { createSessionClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

export async function savePaymentPreference(prevState, formData) {
  const full_name = formData.get("full_name");
  const upi_id = formData.get("upi_id");

  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    // 1. Check if a preference document already exists for this user
    const existingDocs = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_PAYMENT_COLLECTION_ID,
      [Query.equal("user_id", user.$id)]
    );

    if (existingDocs.total > 0) {
      // UPDATE existing document
      const docId = existingDocs.documents[0].$id;
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_PAYMENT_COLLECTION_ID,
        docId,
        { full_name, upi_id }
      );
    } else {
      // CREATE new document
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_PAYMENT_COLLECTION_ID,
        ID.unique(),
        { user_id: user.$id, full_name, upi_id }
      );
    }

    // Refresh the page data so the form shows the new values if needed
    revalidatePath("/payment-preferences");

    return { success: true, message: "Payment preferences updated!" };
  } catch (error) {
    console.error("Payment save error:", error);
    return { success: false, message: error.message };
  }
}
