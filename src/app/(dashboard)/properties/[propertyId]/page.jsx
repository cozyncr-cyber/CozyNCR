import { getListingById } from "@/actions/listings";
import { getUserProfile } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Users,
  Edit2,
  ChevronLeft,
  CheckCircle,
  Briefcase,
  PartyPopper,
  Calendar,
  Baby,
  Dog,
  Sparkles,
  Clock,
  Check,
} from "lucide-react";

// Prevent static generation error
export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }) {
  const listing = await getListingById(params.propertyId);

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Listing not found
          </h2>
          <Link
            href="/properties"
            className="text-rose-600 hover:underline mt-2 inline-block"
          >
            Return to properties
          </Link>
        </div>
      </div>
    );
  }

  // Helper for images
  const getImageUrl = (fileId) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  };

  const images = listing.imageIds || [];
  const addOns = listing.addOns ? JSON.parse(listing.addOns) : [];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-6">
        <Link
          href="/properties"
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 mr-3 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Listings
        </Link>
        <Link
          href={`/properties/${listing.$id}/edit`}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Edit2 className="w-4 h-4" /> Edit Listing
        </Link>
      </div>

      {/* Hero Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight leading-tight">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1.5 font-medium underline decoration-gray-300 hover:text-rose-600 transition-colors cursor-pointer">
            <MapPin className="w-4 h-4" /> {listing.city}, {listing.state}
          </span>
          <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> {listing.maxGuests} Guests
          </span>
          <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-xs font-bold tracking-wide">
            {listing.category}
          </span>
        </div>
      </div>

      {/* Hero Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[450px] md:h-[550px] mb-12 rounded-3xl overflow-hidden shadow-sm">
        {/* Main Large Image */}
        <div className="md:col-span-2 h-full bg-gray-100 relative group cursor-pointer">
          {images[0] ? (
            <>
              <Image
                src={getImageUrl(images[0])}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Main"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
              No Image
            </div>
          )}
        </div>
        {/* Smaller Images Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="bg-gray-100 relative h-full group overflow-hidden cursor-pointer"
            >
              {images[idx] ? (
                <>
                  <Image
                    src={getImageUrl(images[idx])}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={`Gallery ${idx}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </>
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div className="pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              About this space
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap max-w-none">
              {listing.description}
            </div>
          </div>

          {/* Capacity */}
          <div className="pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Who can stay
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all duration-300">
                <Users className="w-6 h-6 text-gray-400 mb-2" />
                <span className="block text-2xl font-bold text-gray-900">
                  {listing.maxGuests}
                </span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                  Adults
                </span>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all duration-300">
                <Baby className="w-6 h-6 text-gray-400 mb-2" />
                <span className="block text-2xl font-bold text-gray-900">
                  {listing.maxChildren || 0}
                </span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                  Children
                </span>
              </div>
              {/* Add infants and pets here similarly */}
            </div>
          </div>

          {/* Amenities */}
          <div className="pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              What this place offers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {listing.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 text-gray-700 group"
                >
                  {/* Small Check icon */}
                  <div className="p-1 rounded-full bg-stone-100 text-stone-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="capitalize font-medium text-[15px] border-b border-transparent group-hover:border-gray-300 transition-colors">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timings */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Operating Hours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    Weekdays
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Check-in</span>
                  <span className="text-gray-900">{listing.weekdayOpen}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium bg-gray-50 p-3 rounded-lg mt-2">
                  <span className="text-gray-500">Check-out</span>
                  <span className="text-gray-900">{listing.weekdayClose}</span>
                </div>
              </div>
              {/* Weekend box */}
              <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PartyPopper className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="font-bold text-purple-900 text-lg">
                    Weekends
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium bg-white p-3 rounded-lg border border-purple-100">
                  <span className="text-purple-600">Check-in</span>
                  <span className="text-gray-900">{listing.weekendOpen}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium bg-white p-3 rounded-lg mt-2 border border-purple-100">
                  <span className="text-purple-600">Check-out</span>
                  <span className="text-gray-900">{listing.weekendClose}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              <div className="bg-gray-900 p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Pricing
                  </h3>
                  {listing.weekendMultiplier > 0 && (
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded text-white">
                      +{listing.weekendMultiplier}% on Weekends
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">
                  Based on selected duration
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  {["1h", "3h", "6h", "12h", "24h"].map((dur) => {
                    const price = listing[`price_${dur}`];
                    if (!price) return null;
                    return (
                      <div
                        key={dur}
                        className="flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                            {dur.replace("h", "")}
                          </div>
                          <span className="text-gray-600 font-medium text-sm">
                            {dur === "1h" ? "Hour" : "Hours"}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">
                          ₹{price}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {addOns.length > 0 && (
                  <div className="pt-5 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Available Add-ons
                    </h4>
                    <div className="space-y-2">
                      {addOns.map((service, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">{service.name}</span>
                          <span className="font-medium text-gray-900">
                            +₹{service.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs font-medium text-gray-500">
                      Cleaning Buffer
                    </div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {listing.bufferTime} min
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
