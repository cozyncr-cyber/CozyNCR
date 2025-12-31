import React from "react";
import Link from "next/link";
import {
  Trash2,
  ShieldAlert,
  Archive,
  UserX,
  FileX,
  Home,
  ChevronLeft,
  Info,
} from "lucide-react";
import { getLoggedInUser } from "@/actions/auth";

export const metadata = {
  title: "Delete Account | CozyNCR",
  description:
    "Information regarding account deletion and data retention policies.",
};

export default async function DeleteAccountPage() {
  // 1. Fetch User Data
  const user = await getLoggedInUser();
  const userId = user?.$id || "Unknown ID";
  const userName = user?.name || "User";

  // 2. Dynamic Mailto
  const deleteMailto = `mailto:cozyncr@gmail.com?subject=Account Deletion Request: ${userName}&body=Hello CozyNCR Admin,%0D%0A%0D%0APlease permanently delete my account and associated data.%0D%0A%0D%0A--- Account Details ---%0D%0AName: ${userName}%0D%0AUser ID: ${userId}%0D%0A%0D%0AI understand this action is irreversible and my listings/reviews will be removed.`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Delete Your Account
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We are sorry to see you go. Before you proceed with deletion, please
            review how we handle your data to ensure transparency and
            compliance.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8 sm:p-10 space-y-10">
            {/* Section 1: What is Removed */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
                <UserX className="w-5 h-5 text-red-500" />
                What is permanently removed
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Personal Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your name, email address, phone number, and profile details
                    will be permanently wiped from our active databases.
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileX className="w-4 h-4" /> Reviews & Comments
                  </h3>
                  <p className="text-sm text-gray-600">
                    Any reviews you have written for properties or hosts will be
                    deleted and will no longer appear on the platform.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: What is Retained */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
                <Archive className="w-5 h-5 text-amber-500" />
                What we retain (and why)
              </h2>
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      User ID & Transaction History
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      While your personal identity is removed, we retain your
                      unique <strong>Account ID ($id)</strong>. This is strictly
                      to maintain the integrity of historical booking records,
                      invoices, and financial audits for hosts and the platform.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Info className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Anonymization
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      This retained ID is dissociated from your personal contact
                      information. It cannot be used to contact you or identify
                      you publicly on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: For Hosts */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
                <Home className="w-5 h-5 text-blue-500" />
                If you are a Host
              </h2>
              <p className="text-gray-600 mb-6">
                Deleting a host account has immediate effects on your properties
                and pending reservations.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">
                      Listings Disabled:
                    </strong>{" "}
                    All your active properties will be immediately unlisted and
                    hidden from search results.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">
                      Booking Cancellations:
                    </strong>{" "}
                    Any upcoming confirmed bookings will be automatically
                    cancelled, and guests will be fully refunded according to
                    our cancellation policy.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">Payouts:</strong> Any
                    pending payouts for completed stays will still be processed
                    to your registered bank account before final closure.
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Contact/Action */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            To proceed with deletion, please contact our support team or use the
            mobile app settings.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/request-data"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Request My Data
            </Link>
            <a
              href={deleteMailto}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              Confirm Deletion Request
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
