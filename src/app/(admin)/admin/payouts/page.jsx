import { getPendingPayouts, markPayoutPaid } from "@/actions/admin";
import { format } from "date-fns";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function PayoutsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 10;

  const {
    documents: payouts,
    total,
    totalPages,
  } = await getPendingPayouts(page, limit);

  async function handlePay(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    await markPayoutPaid(bookingId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Host Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage pending payments to hosts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/payouts/history"
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            <ClockIcon className="w-4 h-4" /> View History
          </Link>
          <span className="bg-gray-900 text-white px-3 py-2 rounded-xl text-sm font-bold">
            Pending: {total}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {payouts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No pending payouts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Host</th>
                  <th className="px-6 py-4">Listing</th>
                  <th className="px-6 py-4">Amount (Host Share)</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((payout) => (
                  <tr
                    key={payout.$id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {payout.hostName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payout.hostPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-700">
                      {payout.listingTitle}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-green-600">
                      ₹{payout.hostShare?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(payout.$createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={handlePay}>
                        <input
                          type="hidden"
                          name="bookingId"
                          value={payout.$id}
                        />
                        <button
                          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                          type="submit"
                        >
                          Mark Paid
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Link
            href={`/admin/payouts?page=${Math.max(1, page - 1)}`}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              page <= 1
                ? "pointer-events-none opacity-40 bg-gray-50 text-gray-400"
                : "hover:bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            Previous
          </Link>
          <span className="text-sm font-medium text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/payouts?page=${Math.min(totalPages, page + 1)}`}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              page >= totalPages
                ? "pointer-events-none opacity-40 bg-gray-50 text-gray-400"
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
