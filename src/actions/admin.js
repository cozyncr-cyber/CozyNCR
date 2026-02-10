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

// --- AUTH HELPERS ---
async function requireAdmin() {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id
    );
    if (userDoc.role !== "admin") throw new Error("Unauthorized");
    return user;
  } catch (error) {
    redirect("/");
  }
}

// --- 4. REFUNDS (Advanced Calculation) ---
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

      const totalPrice = b.totalPrice || 0;

      if (b.status === "rejected") {
        // CASE 1: Host Rejected -> 100% Refund
        refundAmount = totalPrice;
        reason = "Host Rejected (100% Refund)";
      } else if (b.status === "cancelled") {
        // CASE 2: User Cancelled

        // Use cancelledTime if available, else fallback to updatedAt
        const cancelTime = b.cancelledTime
          ? new Date(b.cancelledTime)
          : new Date(b.$updatedAt);
        const bookingTime = new Date(b.$createdAt);
        const checkInTime = new Date(b.startTime);

        // Difference in hours
        const hoursSinceBooking = (cancelTime - bookingTime) / (1000 * 60 * 60);
        const hoursBeforeCheckIn =
          (checkInTime - cancelTime) / (1000 * 60 * 60);

        if (hoursSinceBooking <= 24) {
          // Cancelled within 24h of booking -> 90% Refund
          refundAmount = Math.floor(totalPrice * 0.9);
          reason = "Cancelled within 24h (90% Refund)";
        } else if (hoursBeforeCheckIn >= 4) {
          // Cancelled > 24h after booking BUT > 4h before check-in -> 50% Refund
          refundAmount = Math.floor(totalPrice * 0.5);
          reason = "Cancelled before 4h of checkin (50% Refund)";
        } else {
          // Cancelled < 4h before checkin -> 0% Refund
          refundAmount = 0;
          reason = "Last minute cancellation (0% Refund)";
        }
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

// ... [Include other functions from previous admin.js here to keep file complete] ...
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
          // 1. Fetch Listing
          const listing = await databases.getDocument(
            DATABASE_ID,
            LISTINGS_COLLECTION_ID,
            booking.listingId
          );

          // 2. Fetch Host Profile
          const host = await databases.getDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            listing.ownerId
          );

          // 3. Fetch Payment Preferences for this specific host
          const paymentPrefs = await databases.listDocuments(
            DATABASE_ID,
            'payment_preferences', // Ensure this ID is defined
            [Query.equal("user_id", host.$id), Query.limit(1)]
          );

          const upiId = paymentPrefs.documents.length > 0 
            ? paymentPrefs.documents[0].upi_id 
            : null;

          return {
            ...booking,
            listingTitle: listing.title,
            hostName: host.name,
            hostEmail: host.email,
            hostPhone: host.phone,
            hostId: host.$id,
            upiId: upiId, // Added data
          };
        } catch (e) {
          console.error("Error enriching booking:", e);
          return {
            ...booking,
            listingTitle: "Unknown Listing",
            hostName: "Unknown Host",
            upiId: null,
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
    console.error("Fetch Error:", error);
    return { documents: [], total: 0, totalPages: 0 };
  }
}

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
        Query.orderDesc("$updatedAt"),
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
          return { ...booking, listingTitle: "Unknown", hostName: "Unknown" };
        }
      })
    );
    return {
      documents: enriched,
      total: bookings.total,
      totalPages: Math.ceil(bookings.total / limit),
    };
  } catch (error) {
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
      { payoutStatus: "paid" }
    );
    revalidatePath("/admin/payouts");
    revalidatePath("/admin/payouts/history");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

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
