import { getPendingRefunds, markRefundProcessed } from "@/actions/admin";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RefundsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 10;

  const {
    documents: refunds,
    total,
    totalPages,
  } = await getPendingRefunds(page, limit);

  async function handleRefund(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    await markRefundProcessed(bookingId);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
          Pending: {total}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {refunds.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No pending refunds.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Guest Name</th>
                  <th className="px-6 py-4">Status & Logic</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Refund Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refunds.map((refund) => (
                  <tr
                    key={refund.$id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {refund.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`w-fit px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            refund.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {refund.status}
                        </span>
                        <span className="text-xs text-gray-500 italic">
                          {refund.refundReason}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      ₹{refund.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      ₹{refund.refundAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(refund.$updatedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={handleRefund}>
                        <input
                          type="hidden"
                          name="bookingId"
                          value={refund.$id}
                        />
                        <button
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm"
                          type="submit"
                        >
                          Process Refund
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
            href={`/admin/refunds?page=${Math.max(1, page - 1)}`}
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
            href={`/admin/refunds?page=${Math.min(totalPages, page + 1)}`}
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
