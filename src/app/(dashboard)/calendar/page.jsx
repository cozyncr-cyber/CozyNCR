import React from "react";
import { getCalendarData } from "@/actions/calendarActions";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  parseISO,
} from "date-fns";
import Link from "next/link";

// Ensure the page always fetches fresh data for different searchParams
export const dynamic = "force-dynamic";

export default async function MyCalendarPage({ searchParams }) {
  // Normalize selected date from URL
  const selectedDateStr =
    searchParams?.date || new Date().toISOString().split("T")[0];
  const viewDate = startOfDay(parseISO(selectedDateStr));

  // Calculate month boundaries for the fetch
  const monthStart = startOfMonth(viewDate).toISOString();
  const monthEnd = endOfMonth(viewDate).toISOString();

  const { bookings, listings } = await getCalendarData(monthStart, monthEnd);

  // Define the 24-hour window for the current view
  const dayStart = startOfDay(viewDate);
  const dayEnd = endOfDay(viewDate);

  // Filter bookings that overlap with THIS specific day
  const dayBookings = bookings.filter((b) => {
    const bStart = parseISO(b.startTime);
    const bEnd = parseISO(b.endTime);
    // Overlap logic: booking starts before day ends AND booking ends after day starts
    return bStart < dayEnd && bEnd > dayStart;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar</h2>

            <div className="flex justify-between items-center mb-6">
              <Link
                href={`/calendar?date=${
                  subDays(viewDate, 30).toISOString().split("T")[0]
                }`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <span className="font-bold text-gray-800">
                {format(viewDate, "MMMM yyyy")}
              </span>
              <Link
                href={`/calendar?date=${
                  addDays(viewDate, 30).toISOString().split("T")[0]
                }`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 text-gray-400 font-black uppercase tracking-widest">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d[0]}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {eachDayOfInterval({
                start: startOfMonth(viewDate),
                end: endOfMonth(viewDate),
              }).map((day, idx) => {
                const isSelected = isSameDay(day, viewDate);
                const hasBooking = bookings.some((b) => {
                  const s = parseISO(b.startTime);
                  const e = parseISO(b.endTime);
                  return day >= startOfDay(s) && day <= startOfDay(e);
                });

                return (
                  <Link
                    key={idx}
                    href={`/calendar?date=${format(day, "yyyy-MM-dd")}`}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                      isSelected
                        ? "bg-rose-500 text-white font-bold shadow-md scale-110 z-10"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {format(day, "d")}
                    {hasBooking && !isSelected && (
                      <div className="absolute bottom-1.5 w-1 h-1 bg-rose-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-rose-500 rounded-full" />
              Properties
            </h3>
            <div className="space-y-3">
              {listings.map((l) => (
                <div
                  key={l.$id}
                  className="flex items-center gap-3 group cursor-default"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stringToColor(l.$id) }}
                  />
                  <span className="text-sm text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                    {l.title}
                  </span>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No properties found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {format(viewDate, "EEEE, MMM do")}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                {dayBookings.length} Active Bookings
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/calendar?date=${format(
                  subDays(viewDate, 1),
                  "yyyy-MM-dd"
                )}`}
                className="p-2.5 border rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm bg-white"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <Link
                href={`/calendar?date=${format(
                  addDays(viewDate, 1),
                  "yyyy-MM-dd"
                )}`}
                className="p-2.5 border rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm bg-white"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative overflow-y-auto max-h-[75vh] flex-1">
            <div className="flex flex-col relative min-h-full">
              {hours.map((hour) => (
                <div key={hour} className="flex h-24 group">
                  <div className="w-20 flex-shrink-0 text-right pr-6 pt-2 text-[10px] font-black text-gray-300 border-r border-gray-50 uppercase tracking-tighter">
                    {format(new Date().setHours(hour, 0), "h aa")}
                  </div>
                  <div className="flex-1 border-b border-gray-50 group-last:border-0 relative bg-white" />
                </div>
              ))}

              {/* Booking Overlay */}
              <div className="absolute top-0 right-0 left-20 bottom-0 pointer-events-none pr-4">
                {dayBookings.map((booking) => {
                  const bStart = parseISO(booking.startTime);
                  const bEnd = parseISO(booking.endTime);

                  // Clip start/end to the current day boundaries for visual rendering
                  const renderStart = bStart < dayStart ? dayStart : bStart;
                  const renderEnd = bEnd > dayEnd ? dayEnd : bEnd;

                  const startMinutes =
                    renderStart.getHours() * 60 + renderStart.getMinutes();
                  const endMinutes =
                    renderEnd.getHours() * 60 + renderEnd.getMinutes();

                  const top = (startMinutes / 60) * 96; // 96px is h-24
                  const height = ((endMinutes - startMinutes) / 60) * 96;

                  return (
                    <div
                      key={booking.$id}
                      className="absolute left-3 right-0 rounded-2xl border-l-8 shadow-sm p-4 pointer-events-auto flex flex-col justify-start overflow-hidden transition-all hover:translate-x-1"
                      style={{
                        top: `${top + 4}px`,
                        height: `${Math.max(height - 8, 40)}px`, // Minimum height for visibility
                        backgroundColor: `${booking.color}15`,
                        borderColor: booking.color,
                      }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div
                          className="font-black text-sm truncate"
                          style={{ color: booking.color }}
                        >
                          {booking.listingTitle}
                        </div>
                        <span
                          className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/50 whitespace-nowrap"
                          style={{ color: booking.color }}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-700 truncate mt-0.5">
                        {booking.customerName}
                      </div>
                      <div
                        className="text-[10px] font-black mt-auto opacity-60 flex items-center gap-1"
                        style={{ color: booking.color }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {format(bStart, "p")} - {format(bEnd, "p")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}
