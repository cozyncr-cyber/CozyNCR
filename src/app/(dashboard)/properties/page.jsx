import Link from "next/link";
import Image from "next/image";
import { getUserProperties, deleteProperty } from "@/actions/listings";
import {
  Plus,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Clock,
  ImageOff,
  Eye,
} from "lucide-react";
import DeleteListingButton from "@/components/DeleteListingButton";

// Prevent static generation error
export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getUserProperties();

  // Helper to construct image URL safely
  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
    const endpoint = "https://cloud.appwrite.io/v1"; // Default endpoint
    if (!projectId || !bucketId) return null;
    return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            My Listings
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your properties, prices, and availability.
          </p>
        </div>
        <Link
          href="/properties/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => {
          const imageUrl = getImageUrl(property.thumbnail);

          const priceStart =
            property.price_1h ||
            property.price_3h ||
            property.price_6h ||
            property.price_24h;
          const priceUnit = property.price_1h
            ? "/ hr"
            : property.price_24h
            ? "/ day"
            : "";

          return (
            <div
              key={property.$id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail Image */}
              <Link
                href={`/properties/${property.$id}`}
                className="block relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wide shadow-sm z-10">
                  {property.category}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <Link href={`/properties/${property.$id}`}>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-gray-600 transition-colors mb-2">
                    {property.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">
                    {property.city}, {property.state}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Max {property.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {property.weekdayOpen} - {property.weekdayClose}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Starting From
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {priceStart ? `₹${priceStart}` : "N/A"}
                      <span className="text-sm text-gray-500 font-normal">
                        {priceUnit}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/properties/${property.$id}`}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/properties/${property.$id}/edit`}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                      title="Edit Listing"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <form action={deleteProperty}>
                      <input
                        type="hidden"
                        name="propertyId"
                        value={property.$id}
                      />
                      <DeleteListingButton />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {properties.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <Link href="/properties/create">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 p-4 hover:bg-slate-200 cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            </Link>
            <h3 className="text-lg font-bold text-gray-900">
              No properties yet
            </h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-6 text-sm">
              Create your first listing to start accepting bookings.
            </p>
            <Link
              href="/properties/create"
              className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg"
            >
              Create First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
