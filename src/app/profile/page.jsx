import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/auth";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Clock,
  Edit3,
  UserCircle,
} from "lucide-react";
import AvatarUploader from "@/components/AvatarUploader";

// Helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Helper for "Member Since"
const getMonthYear = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

// This must be async to fetch data
const ProfilePage = async () => {
  // 1. Fetch the user data server-side
  const user = await getUserProfile();

  // 2. Security Check: If no user, kick them to login
  if (!user) {
    redirect("/signin"); // Change to your actual login route
  }

  // 3. Map Appwrite data to UI
  // Note: 'user' contains merged data from Auth and Database
  const userData = {
    fullName: user.name || "No Name",
    role: user.role || "Guest",
    email: user.email,
    phone: user.phone || "Not provided",
    location: user.location || "Not specified",
    dob: formatDate(user.dob),
    // If you haven't implemented property counting yet, hardcode or use a field
    propertiesListed: user.propertiesListed || 0,
    registeredSince: getMonthYear(user.$createdAt), // $createdAt comes from Appwrite
    // Appwrite doesn't store avatars by default unless you use Storage bucket.
    // Using a placeholder or a stored URL if you have one.
    avatarUrl: user.avatarUrl || null,
  };

  return (
    <div className=" py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Identity Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center h-full">
              <div className="relative mb-4">
                <AvatarUploader
                  currentAvatarUrl={userData.avatarUrl}
                  userId={user.$id} // Pass the ID so the uploader knows who to update
                  fullName={userData.fullName}
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {userData.fullName}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-6 capitalize">
                {userData.role}
              </p>

              <div className="w-full border-t border-slate-100 my-2"></div>

              {/* Key Highlight Stat */}
              <div className="w-full py-4">
                <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-4">
                  <Building className="text-blue-600 mb-2" size={24} />
                  <span className="text-2xl font-bold text-slate-800">
                    {userData.propertiesListed}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                    Properties Listed
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Clock size={14} />
                <span>Member since {userData.registeredSince}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-800">
                  Personal Information
                </h3>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InfoItem
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={userData.email}
                />
                <InfoItem
                  icon={<Phone size={18} />}
                  label="Phone Number"
                  value={userData.phone}
                />
                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={userData.location}
                />
                <InfoItem
                  icon={<Calendar size={18} />}
                  label="Date of Birth"
                  value={userData.dob}
                />
              </div>
            </div>

            {/* Verification Status (Bonus based on your KYC field in DB) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">KYC Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.kycStatus === "verified"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  ></div>
                  <span className="font-semibold text-slate-700 capitalize">
                    {user.kycStatus || "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-1 p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-slate-800 font-medium">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
