import CreateListingForm from "@/components/ListingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateListingPage() {
  return (
    <div className="bg-white md:bg-gray-50 min-h-screen md:p-8">
      <div className="max-w-5xl mx-auto mb-6 px-6 pt-6 md:px-0 md:pt-0">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
      <CreateListingForm />
    </div>
  );
}
