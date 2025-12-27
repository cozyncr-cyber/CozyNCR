"use server";

import { Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID;
const BOOKINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID;
const LISTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID;
const KYC_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_KYC_COLLECTION_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// --- AUTHENTICATION CHECK ---
async function requireAdmin() {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const userDoc = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id
    );

    if (userDoc.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return user;
  } catch (error) {
    redirect("/");
  }
}

// --- 1. OVERVIEW STATS ---
export async function getAdminStats() {
  await requireAdmin();
  const { databases } = await createAdminClient();

  try {
    const [users, listings, bookings, pendingKyc] = await Promise.all([
      databases.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID, LISTINGS_COLLECTION_ID, [
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID, BOOKINGS_COLLECTION_ID, [
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID, KYC_COLLECTION_ID, [
        Query.equal("status", "pending"),
        Query.limit(1),
      ]),
    ]);

    return {
      totalUsers: users.total,
      totalListings: listings.total,
      totalBookings: bookings.total,
      pendingKyc: pendingKyc.total,
    };
  } catch (error) {
    return { totalUsers: 0, totalListings: 0, totalBookings: 0, pendingKyc: 0 };
  }
}

// --- 2. HOST PAYOUTS (Pending) ---
export async function getPendingPayouts(page = 1, limit = 10) {
  await requireAdmin();
  const { databases } = await createAdminClient();
  const offset = (page - 1) * limit;

  try {
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("status", "confirmed"),
        Query.notEqual("payoutStatus", "paid"),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const enriched = await Promise.all(
      bookings.documents.map(async (booking) => {
        try {
          const listing = await databases.getDocument(
            DATABASE_ID,
            LISTINGS_COLLECTION_ID,
            booking.listingId
          );
          const host = await databases.getDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            listing.ownerId
          );

          return {
            ...booking,
            listingTitle: listing.title,
            hostName: host.name,
            hostEmail: host.email,
            hostPhone: host.phone,
            hostId: host.$id,
          };
        } catch (e) {
          return {
            ...booking,
            listingTitle: "Unknown Listing",
            hostName: "Unknown Host",
          };
        }
      })
    );

    return {
      documents: enriched,
      total: bookings.total,
      totalPages: Math.ceil(bookings.total / limit),
    };
  } catch (error) {
    console.error("Payout Fetch Error:", error);
    return { documents: [], total: 0, totalPages: 0 };
  }
}

// --- 2.1 HOST PAYOUTS (Completed History) ---
export async function getCompletedPayouts(page = 1, limit = 10) {
  await requireAdmin();
  const { databases } = await createAdminClient();
  const offset = (page - 1) * limit;

  try {
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("payoutStatus", "paid"),
        Query.orderDesc("$updatedAt"), // Sort by when it was paid (updated)
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const enriched = await Promise.all(
      bookings.documents.map(async (booking) => {
        try {
          const listing = await databases.getDocument(
            DATABASE_ID,
            LISTINGS_COLLECTION_ID,
            booking.listingId
          );
          const host = await databases.getDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            listing.ownerId
          );

          return {
            ...booking,
            listingTitle: listing.title,
            hostName: host.name,
            hostEmail: host.email,
            hostPhone: host.phone,
            hostId: host.$id,
          };
        } catch (e) {
          return {
            ...booking,
            listingTitle: "Unknown Listing",
            hostName: "Unknown Host",
          };
        }
      })
    );

    return {
      documents: enriched,
      total: bookings.total,
      totalPages: Math.ceil(bookings.total / limit),
    };
  } catch (error) {
    console.error("Payout History Fetch Error:", error);
    return { documents: [], total: 0, totalPages: 0 };
  }
}

export async function markPayoutPaid(bookingId) {
  await requireAdmin();
  const { databases } = await createAdminClient();
  try {
    await databases.updateDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      bookingId,
      {
        payoutStatus: "paid",
      }
    );
    revalidatePath("/admin/payouts");
    revalidatePath("/admin/payouts/history"); // Refresh history too
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// --- 3. KYC / AADHAR VIEW ---
export async function getPendingKYC() {
  await requireAdmin();
  const { databases } = await createAdminClient();

  try {
    const kycRequests = await databases.listDocuments(
      DATABASE_ID,
      KYC_COLLECTION_ID,
      [Query.equal("status", "pending")]
    );

    const enriched = await Promise.all(
      kycRequests.documents.map(async (req) => {
        try {
          const user = await databases.getDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            req.ownerId
          );
          const aadharUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${req.aadharFileId}/view?project=${PROJECT_ID}`;
          const otherUrl = req.otherFileId
            ? `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${req.otherFileId}/view?project=${PROJECT_ID}`
            : null;

          return {
            ...req,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            aadharUrl,
            otherUrl,
          };
        } catch (e) {
          return null;
        }
      })
    );

    return enriched.filter(Boolean);
  } catch (error) {
    return [];
  }
}

export async function processKYC(kycId, userId, decision) {
  await requireAdmin();
  const { databases } = await createAdminClient();

  const kycStatus = decision === "approve" ? "approved" : "rejected";
  const userStatus = decision === "approve" ? "verified" : "rejected";

  try {
    await databases.updateDocument(DATABASE_ID, KYC_COLLECTION_ID, kycId, {
      status: kycStatus,
    });
    await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, userId, {
      kycStatus: userStatus,
    });
    revalidatePath("/admin/kyc");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// --- 4. REFUNDS ---
export async function getPendingRefunds(page = 1, limit = 10) {
  await requireAdmin();
  const { databases } = await createAdminClient();
  const offset = (page - 1) * limit;

  try {
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      [
        Query.equal("status", ["cancelled", "rejected"]),
        Query.notEqual("refundStatus", "processed"),
        Query.orderDesc("$updatedAt"),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const enrichedBookings = bookings.documents.map((b) => {
      let refundAmount = 0;
      let reason = "";

      if (b.status === "rejected") {
        refundAmount = b.totalPrice;
        reason = "Host Rejected (100% Refund)";
      } else if (b.status === "cancelled") {
        refundAmount = Math.floor(b.totalPrice * 0.9);
        reason = "User Cancelled (90% Refund)";
      }

      return {
        ...b,
        refundAmount,
        refundReason: reason,
      };
    });

    return {
      documents: enrichedBookings,
      total: bookings.total,
      totalPages: Math.ceil(bookings.total / limit),
    };
  } catch (error) {
    console.error("Refund Fetch Error", error);
    return { documents: [], total: 0, totalPages: 0 };
  }
}

export async function markRefundProcessed(bookingId) {
  await requireAdmin();
  const { databases } = await createAdminClient();
  try {
    await databases.updateDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      bookingId,
      {
        refundStatus: "processed",
      }
    );
    revalidatePath("/admin/refunds");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
