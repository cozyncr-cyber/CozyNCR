import React from "react";
import { getListingById } from "@/actions/listings";
import { createSessionClient } from "@/lib/appwrite";
import CreateListingPage from "@/components/createListingForm";

export default async function EditListingPage({ params }) {
  const listing = await getListingById(params.id);

  if (!listing) return <div className="p-10">Listing not found</div>;

  // Security Check (Server Side)
  const { account } = await createSessionClient();
  const user = await account.get();

  if (listing.ownerId !== user.$id) {
    return <div className="p-10 text-red-500">Unauthorized access</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateListingPage initialData={listing} />
    </div>
  );
}
