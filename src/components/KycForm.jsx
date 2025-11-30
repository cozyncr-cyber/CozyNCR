"use client";

import { useState, useTransition } from "react";
import { submitKyc } from "@/actions/data";
import {
  DocumentArrowUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function KycForm({ user }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // If already pending, show status instead of form
  if (user.kycStatus === "pending") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-lg">
        <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <DocumentArrowUpIcon className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-bold text-yellow-900">
          Verification Pending
        </h3>
        <p className="text-sm text-yellow-700 mt-2">
          We have received your documents and are currently reviewing them. You
          will be notified once the process is complete.
        </p>
      </div>
    );
  }

  // If verified, show success
  if (user.kycStatus === "verified") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-lg">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-900">Account Verified</h3>
        <p className="text-sm text-green-700 mt-2">
          You have full access to all listing features.
        </p>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setError("");
    startTransition(async () => {
      const result = await submitKyc(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-lg">
        <h3 className="text-lg font-bold text-green-900">
          Submission Successful
        </h3>
        <p className="text-sm text-green-700 mt-2">
          Your documents have been uploaded securely.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-bold text-green-700 underline"
        >
          Refresh Status
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900">
          Identity Verification
        </h2>
        <p className="text-sm text-gray-500">
          Please upload valid government-issued documents to verify your host
          account.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Aadhar Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors bg-gray-50">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            1. Aadhar Card
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Upload a clear photo of your Aadhar card (Front & Back merged or
            single side).
          </p>
          <input
            type="file"
            name="aadhar"
            accept="image/*,.pdf"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
          />
        </div>

        {/* Other Proof Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors bg-gray-50">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            2. Additional Proof
          </label>
          <p className="text-xs text-gray-500 mb-4">
            PAN Card, Driving License, or Electricity Bill.
          </p>
          <input
            type="file"
            name="other"
            accept="image/*,.pdf"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isPending ? "Uploading Documents..." : "Submit for Verification"}
          </button>
        </div>
      </form>
    </div>
  );
}
