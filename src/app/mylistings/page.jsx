import React from "react";
import Link from "next/link";
import { getUserListings } from "@/actions/listings";
import { Plus, MapPin, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";

// --- Helper: Construct Image URL ---
const getImageUrl = (fileId) => {
  if (!fileId) return null;
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

// --- Helper: Find Lowest Price ---
const getStartingPrice = (listing) => {
  const prices = [
    listing.price_1h,
    listing.price_3h,
    listing.price_6h,
    listing.price_12h,
    listing.price_24h,
  ].filter((p) => p !== null && p > 0); // Remove nulls

  if (prices.length === 0) return "N/A";
  return Math.min(...prices);
};

export default async function MyListingsPage({ searchParams }) {
  // 1. Get Page Number from URL (default to 1)
  const currentPage = Number(searchParams?.page) || 1;

  // 2. Fetch Data
  const { listings, total, limit } = await getUserListings(currentPage);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-500 mt-1">
              Manage your properties and rates
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>

        {/* Empty State */}
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Plus className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No listings yet
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first property listing.
            </p>
            <div className="mt-6">
              <Link
                href="/create-listing"
                className="text-black font-semibold hover:underline"
              >
                Create a Listing &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* Grid Section */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              // Prepare Data for Card
              const thumbnailId =
                listing.thumbnail || (listing.imageIds && listing.imageIds[0]);
              const imageUrl = thumbnailId
                ? getImageUrl(thumbnailId)
                : "/placeholder-house.jpg"; // Fallback image needed?
              const startPrice = getStartingPrice(listing);

              return (
                <Link
                  href={`/mylistings/${listing.$id}`}
                  key={listing.$id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {thumbnailId ? (
                      <Image
                        fill
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      Live
                    </div>

                    {/* Weekend Badge (Conditional) */}
                    {listing.weekendMultiplier > 0 && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded">
                        Weekend Surge: {listing.weekendMultiplier}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded capitalize">
                        {listing.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Max {listing.maxGuests} Guests</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">
                        {listing.city}, {listing.state}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Starts From
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{startPrice}
                          <span className="text-xs font-normal text-gray-500 ml-1">
                            / slot
                          </span>
                        </p>
                      </div>
                      <span className="text-sm font-medium text-black hover:underline decoration-2 underline-offset-4">
                        Manage
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {listings.length > 0 && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <Link
              href={`/mylistings?page=${currentPage - 1}`}
              className={`flex items-center gap-1 text-sm font-medium ${
                currentPage <= 1
                  ? "text-gray-300 pointer-events-none"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>

            <span className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-black">{currentPage}</span> of{" "}
              {totalPages || 1}
            </span>

            <Link
              href={`/mylistings?page=${currentPage + 1}`}
              className={`flex items-center gap-1 text-sm font-medium ${
                currentPage >= totalPages
                  ? "text-gray-300 pointer-events-none"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
