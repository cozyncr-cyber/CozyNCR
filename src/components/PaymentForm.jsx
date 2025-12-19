"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { savePaymentPreference } from "@/actions/paymentActions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
      ${pending ? "bg-rose-400" : "bg-rose-600 hover:bg-rose-700"} 
      transition-colors`}
    >
      {pending ? "Saving..." : "Save Preferences"}
    </button>
  );
}

export default function PaymentForm({ initialData }) {
  const [state, formAction] = useFormState(savePaymentPreference, {
    success: false,
    message: null,
  });

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {state?.message && (
        <div
          className={`mb-4 p-4 rounded-md text-sm ${
            state.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name (as per Bank/UPI)
          </label>
          <input
            name="full_name"
            type="text"
            // PRE-FILL HERE
            defaultValue={initialData?.full_name || ""}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            UPI ID
          </label>
          <input
            name="upi_id"
            type="text"
            // PRE-FILL HERE
            defaultValue={initialData?.upi_id || ""}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
