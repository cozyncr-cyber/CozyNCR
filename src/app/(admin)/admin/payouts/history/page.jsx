import { getCompletedPayouts } from "@/actions/admin";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeftIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function PayoutHistoryPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 10;

  const {
    documents: payouts,
    total,
    totalPages,
  } = await getCompletedPayouts(page, limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/payouts"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payout History</h1>
            <p className="text-sm text-gray-500">
              Record of all payments made to hosts.
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Total Records: {total}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {payouts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No completed payouts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Paid To (Host)</th>
                  <th className="px-6 py-4">Listing</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Paid On</th>
                  <th className="px-6 py-4 text-right">Status</th>
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
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {payout.hostEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="font-medium">{payout.listingTitle}</div>
                      <div className="text-xs text-gray-400">
                        ID: {payout.listingId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      ₹{payout.hostShare?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(
                        new Date(payout.$updatedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        <CheckBadgeIcon className="w-3 h-3" /> Paid
                      </span>
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
            href={`/admin/payouts/history?page=${Math.max(1, page - 1)}`}
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
            href={`/admin/payouts/history?page=${Math.min(
              totalPages,
              page + 1
            )}`}
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
