import React from "react";
import { getHostBookings, updateBookingStatus } from "@/actions/bookingActions";
import { format } from "date-fns";
import Link from "next/link";

export default async function HostBookingsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 10;

  const { documents: bookings, total } = await getHostBookings(page, limit);
  const totalPages = Math.ceil(total / limit);

  async function handleAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    const status = formData.get("status");
    await updateBookingStatus(bookingId, status);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Booking Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage incoming reservations for your listings.
          </p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {total}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
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
          {bookings.map((booking) => (
            <div
              key={booking.$id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {booking.listingTitle}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-8">
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                      <span className="text-gray-400">Guest:</span>{" "}
                      {booking.customerName}
                    </p>
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                      <span className="text-gray-400">Total:</span> $
                      {booking.totalPrice?.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <span className="text-gray-400 italic">Check-in:</span>{" "}
                      {format(new Date(booking.startTime), "MMM d, yyyy")}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <span className="text-gray-400 italic">Check-out:</span>{" "}
                      {format(new Date(booking.endTime), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                  {booking.status !== "confirmed" &&
                  booking.status !== "rejected" ? (
                    <>
                      <form action={handleAction}>
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking.$id}
                        />
                        <input type="hidden" name="status" value="confirmed" />
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
                        >
                          Approve
                        </button>
                      </form>

                      <form action={handleAction}>
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking.$id}
                        />
                        <input type="hidden" name="status" value="rejected" />
                        <button
                          type="submit"
                          className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all"
                        >
                          Reject
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm font-medium flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Processed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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

          <div className="flex gap-2">
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
