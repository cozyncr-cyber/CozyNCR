"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, UserCircle } from "lucide-react";
import { uploadProfileImage } from "@/actions/profileActions";
import { useRouter } from "next/navigation";

const AvatarUploader = ({ currentAvatarUrl, userId, fullName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Check file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const result = await uploadProfileImage(formData);

      if (result.error) {
        alert(result.error);
      } else {
        // Success! The server action already revalidated the path,
        // but we can also refresh the router to be sure.
        router.refresh();
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleImageClick}>
      {/* 1. The Image Display */}
      <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-50 bg-slate-100 flex items-center justify-center relative">
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt={fullName}
            width={128}
            height={128}
            className={`object-cover w-full h-full transition-opacity duration-300 ${
              isUploading ? "opacity-50" : "opacity-100"
            }`}
          />
        ) : (
          <UserCircle size={64} className="text-slate-300" />
        )}
      </div>

      {/* 2. Hover Overlay */}
      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Camera className="text-white" size={24} />
      </div>

      {/* 3. Loading Spinner Overlay */}
      {isUploading && (
        <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
          <Loader2 className="text-white animate-spin" size={32} />
        </div>
      )}

      {/* 4. Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />
    </div>
  );
};

export default AvatarUploader;
