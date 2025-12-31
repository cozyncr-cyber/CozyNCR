"use client";

import { useState, useRef, useTransition } from "react";
import { updateUserProfile, uploadAvatar } from "@/actions/data";
import {
  CameraIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export default function ProfileForm({ user }) {
  const [isPending, startTransition] = useTransition();
  const [avatarPending, startAvatarTransition] = useTransition();
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(user.avatarUrl);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    startAvatarTransition(async () => {
      try {
        const result = await uploadAvatar(formData);
        if (result.error) {
          alert(result.error);
          setPreviewUrl(user.avatarUrl);
        }
      } catch (error) {
        console.error("Client upload error", error);
        setPreviewUrl(user.avatarUrl);
      }
    });
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (formData) => {
    const dob = formData.get("dob");
    setFormError("");

    if (dob) {
      const age = calculateAge(dob);
      if (age < 18) {
        setFormError("You must be at least 18 years old to use this platform.");
        return;
      }
      if (age > 100) {
        setFormError("Please enter a valid date of birth.");
        return;
      }
    }

    startTransition(async () => {
      const result = await updateUserProfile(formData);
      if (result.error) {
        setFormError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* --- LEFT COLUMN: AVATAR & STATUS --- */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full flex flex-col items-center">
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md ring-1 ring-gray-100 relative">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl text-gray-300 font-bold bg-gray-50">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>

            {avatarPending && (
              <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm font-semibold text-gray-900 capitalize px-2 py-1 bg-white rounded-md border shadow-sm">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">KYC Status</span>
              <div className="flex items-center gap-1.5">
                {user.kycStatus === "verified" ? (
                  <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                )}
                <span
                  className={`text-sm font-medium capitalize ${
                    user.kycStatus === "verified"
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {user.kycStatus || "Pending"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center p-3 hover:bg-red-500 hover:text-white bg-slate-100 rounded-xl">
              <Link href={"/delete-account"}>
                <button className="text-black font-bold">Delete Account</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: EDITABLE DETAILS --- */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Personal Information
            </h3>
            <p className="text-sm text-gray-500">
              Update your personal details here.
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  defaultValue={user.name}
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  disabled
                  value={user.email}
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  name="phone"
                  defaultValue={user.phone}
                  type="tel"
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">
                  Contact support to change phone number.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  defaultValue={user.dob}
                  type="date"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  name="location"
                  defaultValue={user.location}
                  type="text"
                  placeholder="e.g. New Delhi, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormError("")}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Reset Errors
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
