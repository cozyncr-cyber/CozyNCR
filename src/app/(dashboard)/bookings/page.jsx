import React from "react";
import {
  getHostBookings,
  updateBookingStatus,
  getHostListingsSimple,
} from "@/actions/bookingActions";
import Link from "next/link";
import {
  User,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Clock,
  Ban,
} from "lucide-react";
import BlockDatesModal from "@/components/BlockDatesModal";

export const dynamic = "force-dynamic";

// --- TIMEZONE HELPER ---
const formatIST = (dateString, type = "date") => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  if (type === "date") {
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (type === "time") {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
};

export default async function HostBookingsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 10;

  const [{ documents: bookings, total }, listings] = await Promise.all([
    getHostBookings(page, limit),
    getHostListingsSimple(),
  ]);

  const totalPages = Math.ceil(total / limit);

  async function handleAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    const status = formData.get("status");
    await updateBookingStatus(bookingId, status);
  }

  const parseAddOns = (addOnsString) => {
    if (!addOnsString) return [];
    try {
      const parsed = JSON.parse(addOnsString);
      return Array.isArray(parsed) ? parsed : [addOnsString];
    } catch (e) {
      return addOnsString.includes(",")
        ? addOnsString.split(",").map((s) => s.trim())
        : [addOnsString];
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Booking Requests
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage incoming reservations and calendar blocks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BlockDatesModal listings={listings} />

          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
            Total: {total}
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No booking requests found.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            When guests book your space, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const addOns = parseAddOns(booking.addOns);
            const isBlocked = booking.status === "blocked";

            // Use the new timezone-aware formatter
            const checkInDate = formatIST(booking.startTime, "date");
            const checkInTime = formatIST(booking.startTime, "time");
            const checkOutDate = formatIST(booking.endTime, "date");
            const checkOutTime = formatIST(booking.endTime, "time");

            return (
              <div
                key={booking.$id}
                className={`bg-white border rounded-2xl shadow-sm transition-all duration-200 overflow-hidden ${
                  isBlocked
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                {/* --- CARD HEADER --- */}
                <div
                  className={`p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                    isBlocked
                      ? "bg-gray-100 border-gray-200"
                      : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {booking.listingTitle}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium mt-1">
                      ID: {booking.$id.substring(0, 8)}...
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : isBlocked
                        ? "bg-gray-200 text-gray-700 border border-gray-300"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isBlocked && <Ban className="w-3 h-3" />}
                    {booking.status || "pending"}
                  </span>
                </div>

                {/* --- CARD BODY --- */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Column 1: Guest Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <User className="h-5 w-5 text-gray-400" />
                        {booking.customerName}
                      </div>
                      {!isBlocked && (
                        <div className="text-sm text-gray-600 pl-7 space-y-1">
                          <p>
                            Guests:{" "}
                            <span className="font-medium">
                              {booking.guestCount || 1}
                            </span>
                          </p>
                          {booking.childrenCount > 0 && (
                            <p>
                              Children:{" "}
                              <span className="font-medium">
                                {booking.childrenCount}
                              </span>
                            </p>
                          )}
                          {booking.petCount > 0 && (
                            <p>
                              Pets:{" "}
                              <span className="font-medium">
                                {booking.petCount}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                      {isBlocked && (
                        <p className="text-xs text-gray-500 pl-7">
                          Manual block created by host.
                        </p>
                      )}
                    </div>

                    {/* Column 2: Date & Time */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-500 text-xs uppercase font-bold">
                            Start
                          </p>
                          <p className="font-semibold text-gray-900">
                            {checkInDate}
                          </p>
                          <p className="text-gray-500">{checkInTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-500 text-xs uppercase font-bold">
                            End
                          </p>
                          <p className="font-semibold text-gray-900">
                            {checkOutDate}
                          </p>
                          <p className="text-gray-500">{checkOutTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Add-ons */}
                    <div className="space-y-2">
                      {!isBlocked && (
                        <>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                            Add-ons
                          </div>
                          <div className="pl-7">
                            {addOns.length > 0 ? (
                              <ul className="text-sm text-gray-600 list-disc list-inside">
                                {addOns.map((item, idx) => {
                                  let label = item;
                                  let price = null;
                                  if (
                                    typeof item === "object" &&
                                    item !== null
                                  ) {
                                    label = item.name;
                                    price = item.price;
                                  }
                                  return (
                                    <li key={idx} className="capitalize">
                                      {label} {price ? `- ₹${price}` : ""}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-400 italic">
                                None selected
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Column 4: Financials */}
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-gray-100">
                      {isBlocked ? (
                        <p className="text-sm text-gray-400 italic">
                          Calendar Blocked
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                            Your Earnings
                          </p>
                          <div className="text-2xl font-bold text-gray-900 flex items-center">
                            <IndianRupee className="h-5 w-5 text-gray-400 mr-1" />
                            {booking.hostShare
                              ? booking.hostShare.toLocaleString()
                              : "0"}
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Total Paid: ₹
                            {booking.totalPrice?.toLocaleString() || "0"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- ACTIONS --- */}
                {booking.status !== "confirmed" &&
                  booking.status !== "rejected" &&
                  booking.status !== "blocked" && (
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                      <form action={handleAction} className="w-full sm:w-auto">
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking.$id}
                        />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm text-sm">
                          Decline
                        </button>
                      </form>
                      <form action={handleAction} className="w-full sm:w-auto">
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking.$id}
                        />
                        <input type="hidden" name="status" value="confirmed" />
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black active:scale-95 transition-all shadow-md text-sm">
                          Accept Request
                        </button>
                      </form>
                    </div>
                  )}

                {isBlocked && (
                  <div className="px-4 sm:px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-end">
                    <form action={handleAction}>
                      <input
                        type="hidden"
                        name="bookingId"
                        value={booking.$id}
                      />
                      <input type="hidden" name="status" value="cancelled" />
                      <button className="text-sm text-red-600 hover:text-red-800 font-medium underline">
                        Remove Block
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Link
            href={`/bookings?page=${Math.max(1, page - 1)}`}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              page <= 1
                ? "pointer-events-none opacity-40 bg-gray-50"
                : "hover:bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            Previous
          </Link>
          <div className="hidden sm:flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i + 1}
                href={`/bookings?page=${i + 1}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                  page === i + 1
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
          <Link
            href={`/bookings?page=${Math.min(totalPages, page + 1)}`}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              page >= totalPages
                ? "pointer-events-none opacity-40 bg-gray-50"
                : "hover:bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
