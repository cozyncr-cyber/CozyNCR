"use client";

import React, { useState } from "react";
import { X, Calendar, Loader2, Ban } from "lucide-react";
// Ensure this import path is correct for your project structure
import { createManualBlock } from "@/actions/bookingActions";

export default function BlockDatesModal({ listings = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);

    // --- TIMEZONE FIX ---
    // 1. Get the raw values (e.g., "2025-12-31T14:00")
    const rawStart = formData.get("startTime");
    const rawEnd = formData.get("endTime");

    // 2. Create Date objects (Browser assumes these are in local user time, e.g., IST)
    const startDate = new Date(rawStart);
    const endDate = new Date(rawEnd);

    // 3. Convert to ISO UTC Strings (e.g., "2025-12-31T08:30:00.000Z")
    // Appwrite expects UTC. This fixes the +5:30 offset issue.
    formData.set("startTime", startDate.toISOString());
    formData.set("endTime", endDate.toISOString());

    const result = await createManualBlock(formData);

    if (result.success) {
      setIsOpen(false);
      e.target.reset();
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
      >
        <Ban className="w-4 h-4" />
        Block Dates
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Block Calendar
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Listing Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Property
            </label>
            <select
              name="listingId"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white text-sm"
            >
              <option value="">-- Choose a Listing --</option>
              {listings.length > 0 ? (
                listings.map((l) => (
                  <option key={l.$id} value={l.$id}>
                    {l.title}
                  </option>
                ))
              ) : (
                <option disabled>No listings found</option>
              )}
            </select>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Blocking...
                </>
              ) : (
                "Confirm Block"
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              This will mark the dates as &quot;Blocked&quot; and prevent new
              bookings.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
