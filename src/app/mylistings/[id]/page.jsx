import React from "react";
import { getListingById, deleteListing } from "@/actions/listings";
import { redirect } from "next/navigation";
import {
  MapPin,
  Clock,
  Users,
  Trash2,
  Edit,
  ChevronLeft,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Monitor,
  Coffee,
  Home,
  Armchair,
  PartyPopper,
  Castle,
  Briefcase,
  Music,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- MAPPINGS (Reuse for consistency) ---
const AMENITY_ICONS = {
  wifi: <Wifi className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  ac: <Snowflake className="w-5 h-5" />,
  tv: <Tv className="w-5 h-5" />,
  desk: <Monitor className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
};

const CATEGORY_ICONS = {
  apartment: <Home className="w-4 h-4" />,
  studio: <Armchair className="w-4 h-4" />,
  hall: <PartyPopper className="w-4 h-4" />,
  villa: <Castle className="w-4 h-4" />,
  office: <Briefcase className="w-4 h-4" />,
  jamroom: <Music className="w-4 h-4" />,
};

const DURATION_LABELS = {
  price_1h: "1 Hour",
  price_3h: "3 Hours",
  price_6h: "6 Hours",
  price_12h: "12 Hours",
  price_24h: "24 Hours",
};

// --- Helper: Image URL ---
const getImageUrl = (fileId) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export default async function ListingDetailsPage({ params }) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return <div className="p-10 text-center">Listing not found</div>;
  }

  // --- Server Action for Delete Button ---
  async function handleDelete() {
    "use server";
    await deleteListing(params.id);
    redirect("/mylistings");
  }

  // Prepare Images
  const images = listing.imageIds.map(getImageUrl);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Navbar / Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a
            href="/mylistings"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </a>

          <div className="flex items-center gap-2">
            <button className="flex w-full p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Link
                href={`/mylistings/${params.id}/edit`}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </button>
            <form action={handleDelete}>
              <button
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 2. Hero Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {listing.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {listing.city}, {listing.state}
            </div>
            <div className="flex items-center gap-1 capitalize">
              {CATEGORY_ICONS[listing.category] || <Home className="w-4 h-4" />}
              {listing.category}
            </div>
          </div>
        </div>

        {/* 3. Image Gallery (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
          {/* Main Image (Takes half space) */}
          <div className="md:col-span-2 md:row-span-2 relative h-full bg-gray-100">
            <Image
              fill
              src={images[0]}
              alt="Main"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Smaller Images */}
          <div className="hidden md:block relative bg-gray-100">
            {images[1] && (
              <Image
                fill
                src={images[1]}
                alt="Gallery 2"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="hidden md:block relative bg-gray-100">
            {images[2] && (
              <Image
                fill
                src={images[2]}
                alt="Gallery 3"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="hidden md:block relative bg-gray-100">
            {images[3] && (
              <Image
                fill
                src={images[3]}
                alt="Gallery 4"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="hidden md:block relative bg-gray-100">
            {images[4] && (
              <>
                <Image
                  fill
                  src={images[4]}
                  alt="Gallery 5"
                  className="w-full h-full object-cover opacity-80"
                />
                {images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-bold text-xl">
                    +{images.length - 5}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                About this space
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="text-gray-600">
                      {AMENITY_ICONS[amenity] || <Check className="w-5 h-5" />}
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule & Rules */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Weekdays
                  </p>
                  <p className="text-gray-900 font-medium">
                    {listing.weekdayOpen} - {listing.weekdayClose}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Weekends
                  </p>
                  <p className="text-gray-900 font-medium">
                    {listing.weekendOpen} - {listing.weekendClose}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Max Guests
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">
                      {listing.maxGuests} People
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Turnover Buffer
                  </p>
                  <span className="font-medium">
                    {listing.bufferTime} Minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Rate Card (Sticky) */}
          <div className="relative">
            <div className="sticky top-24 bg-white border border-gray-200 shadow-xl shadow-gray-100 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Rate Card</h3>
                {listing.weekendMultiplier > 0 && (
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                    +{listing.weekendMultiplier}% on Weekends
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {[
                  "price_1h",
                  "price_3h",
                  "price_6h",
                  "price_12h",
                  "price_24h",
                ].map((key) => {
                  if (!listing[key]) return null;
                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {DURATION_LABELS[key]}
                      </span>
                      <span className="text-base font-bold text-black">
                        ₹{listing[key]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Location pinned at {listing.latitude?.toFixed(4)},{" "}
                  {listing.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
