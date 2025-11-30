"use client";

import { useState, useMemo } from "react";
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  parseISO,
  getHours,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Clock,
  Users,
  Plus,
  LayoutGrid,
} from "lucide-react";
import { generateDummyBookings } from "@/actions/calendar";

export default function CalendarView({ listings, initialBookings }) {
  const [selectedListingId, setSelectedListingId] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingDummy, setLoadingDummy] = useState(false);

  // 1. Filter Bookings for Selected Date
  const dailyBookings = useMemo(() => {
    return initialBookings.filter((b) =>
      isSameDay(parseISO(b.startTime), selectedDate)
    );
  }, [initialBookings, selectedDate]);

  // 2. Filter Bookings for Display (Specific vs All)
  const displayBookings = useMemo(() => {
    if (selectedListingId === "all") return dailyBookings;
    return dailyBookings.filter((b) => b.listingId === selectedListingId);
  }, [dailyBookings, selectedListingId]);

  // Helper to generate hours (8:00 to 23:00)
  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 8);

  const handleGenerate = async () => {
    setLoadingDummy(true);
    // Pass all IDs to generate random bookings across properties
    const allIds = listings.map((l) => l.$id);
    await generateDummyBookings(allIds);
    window.location.reload();
  };

  // Determine Columns for the Grid
  // If "All", columns = all listings. If specific, column = just that listing.
  const gridColumns =
    selectedListingId === "all"
      ? listings
      : listings.filter((l) => l.$id === selectedListingId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* --- TOP BAR: CONTROLS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        {/* Controls Left */}
        <div className="flex items-center gap-4">
          {/* Listing Selector */}
          <div className="relative">
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-900 text-lg font-serif font-bold py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer min-w-[200px]"
            >
              <option value="all">All Properties</option>
              <option disabled>──────────</option>
              {listings.map((l) => (
                <option key={l.$id} value={l.$id}>
                  {l.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setSelectedDate((d) => addDays(d, -1))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 font-medium text-gray-900 min-w-[140px] text-center">
              {format(selectedDate, "EEE, MMM do")}
            </div>
            <button
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-4">
          {/* Stats Pill */}
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Total Bookings
              </span>
              <span className="font-bold text-gray-900">
                {dailyBookings.length}
              </span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Est. Revenue
              </span>
              <span className="font-bold text-green-600">
                ₹
                {dailyBookings
                  .reduce((acc, b) => acc + (b.totalPrice || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>

          {/* Seed Data Button */}
          <button
            onClick={handleGenerate}
            disabled={loadingDummy}
            className="flex items-center gap-2 text-xs bg-black text-white hover:bg-gray-800 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            {loadingDummy ? "Adding..." : "Add Test Bookings"}
          </button>
        </div>
      </div>

      {/* --- MAIN CALENDAR GRID --- */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
        {/* Header Row (Properties) */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <div className="w-20 shrink-0 p-4 border-r border-gray-100 bg-white z-10 sticky left-0">
            <span className="text-xs font-bold text-gray-400">TIME</span>
          </div>
          <div className="flex flex-1 overflow-x-auto no-scrollbar">
            {gridColumns.map((listing, idx) => (
              <div
                key={listing.$id}
                className="min-w-[200px] flex-1 p-4 border-r border-gray-100 text-center last:border-0"
              >
                <h3 className="font-bold text-gray-900 text-sm truncate px-2">
                  {listing.title}
                </h3>
                <p className="text-[10px] text-gray-500">{listing.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Timeline Area */}
        <div className="flex-1 overflow-y-auto relative flex">
          {/* Time Axis (Sticky Left) */}
          <div className="w-20 shrink-0 bg-white border-r border-gray-100 sticky left-0 z-10">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-gray-50 text-right pr-4 pt-2"
              >
                <span className="text-xs text-gray-400 font-medium transform -translate-y-1/2 block">
                  {hour > 12
                    ? `${hour - 12} PM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          <div className="flex flex-1 relative min-w-0">
            {gridColumns.map((listing) => (
              <div
                key={listing.$id}
                className="flex-1 min-w-[200px] border-r border-gray-50 relative bg-[url('/grid-pattern.png')]"
              >
                {/* Horizontal Lines for Grid */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-20 border-b border-gray-50" />
                ))}

                {/* Bookings for this listing */}
                {displayBookings
                  .filter((b) => b.listingId === listing.$id)
                  .map((booking) => {
                    const start = parseISO(booking.startTime);
                    const end = parseISO(booking.endTime);
                    const startHour = getHours(start);
                    const durationHours = (end - start) / (1000 * 60 * 60);

                    // Calculate Top & Height
                    const top = (startHour - 8) * 80;
                    const height = durationHours * 80;

                    return (
                      <div
                        key={booking.$id}
                        className="absolute left-1 right-1 rounded-lg bg-rose-50 border border-rose-100 p-2 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center overflow-hidden z-0"
                        style={{ top: `${top}px`, height: `${height - 2}px` }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-rose-900 text-xs truncate">
                            {booking.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-rose-700 leading-tight">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {format(start, "h:mm")} - {format(end, "h:mm a")}
                          </span>
                        </div>
                        {height > 50 && (
                          <div className="mt-1 text-[10px] font-bold text-rose-500 bg-white/50 px-1 rounded inline-block w-max">
                            {booking.serviceType || "Booking"}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Current Time Line (Only if today) */}
                {isSameDay(new Date(), selectedDate) && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none opacity-50"
                    style={{
                      top: `${
                        (new Date().getHours() - 8) * 80 +
                        (new Date().getMinutes() / 60) * 80
                      }px`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
