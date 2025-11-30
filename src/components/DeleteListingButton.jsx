"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteListingButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Listing"
      onClick={(e) => {
        // Optional: Confirm dialog
        if (
          !confirm(
            "Are you sure you want to delete this listing? This action cannot be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
