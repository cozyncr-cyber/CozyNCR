import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import PaymentForm from "@/components/PaymentForm";

export default async function PaymentPreferencesPage() {
  // 1. Fetch data on the server
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const prefs = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    process.env.NEXT_PUBLIC_PAYMENT_COLLECTION_ID,
    [Query.equal("user_id", user.$id)]
  );

  // 2. Extract the first document if it exists
  const initialData = prefs.documents.length > 0 ? prefs.documents[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Payment Preferences
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* 3. Pass data to the client component */}
        <PaymentForm initialData={initialData} />
      </div>
    </div>
  );
}
