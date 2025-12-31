import React from "react";
import Link from "next/link";
import { ChevronLeft, Database, Mail, ArrowUpRight } from "lucide-react";
import { getLoggedInUser } from "@/actions/auth";

export const metadata = {
  title: "Request Data | CozyNCR",
  description: "Request a copy of your personal data.",
};

export default async function RequestDataPage() {
  // 1. Fetch User Data Dynamically
  const user = await getLoggedInUser();

  const userName = user?.name || "[Insert Your Name]";
  const userEmail = user?.email || "[Insert Email]";
  const userId = user?.$id || "[Insert User ID]";

  // 2. Construct Dynamic Mailto Link
  const mailtoLink = `mailto:cozyncr@gmail.com?subject=Data Request: ${userName}&body=Hello CozyNCR Team,%0D%0A%0D%0AI would like to request a copy of my personal data associated with my account.%0D%0A%0D%0A--- User Details ---%0D%0AName: ${userName}%0D%0AEmail: ${userEmail}%0D%0AUser ID: ${userId}%0D%0A%0D%0AThank you.`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 p-10 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-3">
              Request Your Data
            </h1>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Transparency is key. You have the right to access the personal
              information we hold about you.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  How it works
                </h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  To ensure security and verify ownership, please email us
                  directly from your registered email address. Our data
                  protection team will compile your information and send it back
                  to you within 30 days.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                We will provide:
              </h4>
              <ul className="space-y-3">
                {[
                  "Profile Information",
                  "Booking History",
                  "Transaction Records",
                  "Saved Preferences",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <a
                href={mailtoLink}
                className="group w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Send Email Request
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <p className="text-xs text-center text-gray-400 mt-4">
                Clicking above will open your default email client with your
                details pre-filled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
