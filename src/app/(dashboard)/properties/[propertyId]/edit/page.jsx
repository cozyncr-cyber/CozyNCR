import { getListingById } from "@/actions/listings";
import CreateListingForm from "@/components/CreateListingForm";
import { redirect } from "next/navigation";

export default async function EditPropertyPage({ params }) {
  const listing = await getListingById(params.propertyId);

  if (!listing) {
    redirect("/properties");
  }

  return (
    <div className="bg-white md:bg-gray-50 min-h-screen md:p-8">
      <CreateListingForm initialData={listing} />
    </div>
  );
}
