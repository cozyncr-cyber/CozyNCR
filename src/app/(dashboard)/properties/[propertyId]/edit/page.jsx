import { getListingById } from "@/actions/listings";
import { getLoggedInUser } from "@/actions/auth";
import CreateListingForm from "@/components/ListingForm";
import { redirect } from "next/navigation";

export default async function EditPropertyPage({ params }) {
  // Fetch listing and user in parallel for speed
  const [listing, user] = await Promise.all([
    getListingById(params.propertyId),
    getLoggedInUser(),
  ]);

  // 1. If listing doesn't exist
  if (!listing) {
    redirect("/properties");
  }

  // 2. SECURITY CHECK: Verify Ownership
  // If user is not logged in OR user ID doesn't match owner ID
  if (!user || listing.ownerId !== user.$id) {
    // Redirect unauthorized users away (e.g., to the property detail page or listings list)
    redirect(`/properties/${params.propertyId}`);
  }

  return (
    <div className="bg-white md:bg-gray-50 min-h-screen md:p-8">
      <CreateListingForm initialData={listing} />
    </div>
  );
}
