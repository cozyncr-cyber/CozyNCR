import { getPendingKYC, processKYC } from "@/actions/admin";
import Image from "next/image"; // Note: Appwrite view URLs might not work well with Next Image Optimization without config, using img tag is safer for unknown domains or configured domains
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

export default async function KYCPage() {
  const requests = await getPendingKYC();

  async function handleDecision(formData) {
    "use server";
    const kycId = formData.get("kycId");
    const userId = formData.get("userId");
    const decision = formData.get("decision");
    await processKYC(kycId, userId, decision);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>

      {requests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed text-center text-gray-500">
          No pending KYC requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => (
            <div
              key={req.$id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col lg:flex-row"
            >
              {/* User Info */}
              <div className="p-6 lg:w-1/3 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {req.userName}
                </h3>
                <div className="space-y-1 mt-2 text-sm text-gray-600">
                  <p>Email: {req.userEmail}</p>
                  <p>Phone: {req.userPhone}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Req ID: {req.$id}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <form action={handleDecision} className="flex-1">
                    <input type="hidden" name="kycId" value={req.$id} />
                    <input type="hidden" name="userId" value={req.ownerId} />
                    <input type="hidden" name="decision" value="approve" />
                    <button className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold transition-colors">
                      <CheckCircleIcon className="w-5 h-5" /> Approve
                    </button>
                  </form>
                  <form action={handleDecision} className="flex-1">
                    <input type="hidden" name="kycId" value={req.$id} />
                    <input type="hidden" name="userId" value={req.ownerId} />
                    <input type="hidden" name="decision" value="reject" />
                    <button className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 py-2.5 rounded-xl font-bold transition-all">
                      <XCircleIcon className="w-5 h-5" /> Reject
                    </button>
                  </form>
                </div>
              </div>

              {/* Documents */}
              <div className="p-6 lg:w-2/3 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Aadhar Card
                  </h4>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    {/* Using iframe to support PDFs or standard img for images */}
                    <iframe
                      src={req.aadharUrl}
                      className="w-full h-full object-contain"
                      title="Aadhar Document"
                    />
                  </div>
                  <a
                    href={req.aadharUrl}
                    target="_blank"
                    className="text-xs text-blue-600 mt-2 inline-block hover:underline"
                  >
                    Open in new tab
                  </a>
                </div>

                {req.otherUrl && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Other Document
                    </h4>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                      <iframe
                        src={req.otherUrl}
                        className="w-full h-full object-contain"
                        title="Other Document"
                      />
                    </div>
                    <a
                      href={req.otherUrl}
                      target="_blank"
                      className="text-xs text-blue-600 mt-2 inline-block hover:underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
