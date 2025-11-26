"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Armchair,
  PartyPopper,
  Castle,
  Briefcase,
  Music,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Monitor,
  Coffee,
  Check,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  MapPin,
  X,
  AlertCircle,
  GripHorizontal,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { createListing, updateListing } from "@/actions/listings";
import Image from "next/image";

const STEPS = [
  { id: 1, label: "The Basics" },
  { id: 2, label: "Location" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Amenities" },
  { id: 6, label: "Photos" },
];

const CATEGORIES = [
  {
    id: "apartment",
    label: "Apartment",
    icon: <Home className="w-8 h-8 mb-2" />,
  },
  {
    id: "studio",
    label: "Studio",
    icon: <Armchair className="w-8 h-8 mb-2" />,
  },
  {
    id: "hall",
    label: "Event Hall",
    icon: <PartyPopper className="w-8 h-8 mb-2" />,
  },
  { id: "villa", label: "Villa", icon: <Castle className="w-8 h-8 mb-2" /> },
  {
    id: "office",
    label: "Office/Pod",
    icon: <Briefcase className="w-8 h-8 mb-2" />,
  },
  {
    id: "jamroom",
    label: "Jam Room",
    icon: <Music className="w-8 h-8 mb-2" />,
  },
];

const AMENITIES = [
  { id: "wifi", label: "Fast Wifi", icon: <Wifi /> },
  { id: "parking", label: "Parking", icon: <Car /> },
  { id: "ac", label: "Air Conditioning", icon: <Snowflake /> },
  { id: "tv", label: "Smart TV", icon: <Tv /> },
  { id: "desk", label: "Work Desk", icon: <Monitor /> },
  { id: "coffee", label: "Coffee Machine", icon: <Coffee /> },
];

const DURATIONS = [
  { id: "1h", label: "1 Hour" },
  { id: "3h", label: "3 Hours" },
  { id: "6h", label: "6 Hours" },
  { id: "12h", label: "12 Hours" },
  { id: "24h", label: "24 Hours" },
];

const getImageUrl = (fileId) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export default function CreateListingPage({ initialData = null }) {
  const isEditMode = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false); // State for upload drop zone visual
  const [draggedImageIndex, setDraggedImageIndex] = useState(null); // State for reordering images
  const [isLocating, setIsLocating] = useState(false); // State for Geolocation loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    maxGuests: initialData?.maxGuests || 2,

    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",

    // Parse pricing: Convert "price_1h" DB keys to our form structure
    offeredDurations: initialData
      ? DURATIONS.map((d) => d.id).filter(
          (id) => initialData[`price_${id}`] !== null
        )
      : [],
    prices: {
      "1h": initialData?.price_1h || "",
      "3h": initialData?.price_3h || "",
      "6h": initialData?.price_6h || "",
      "12h": initialData?.price_12h || "",
      "24h": initialData?.price_24h || "",
    },
    weekendMultiplier: initialData?.weekendMultiplier || 0,

    weekdayOpen: initialData?.weekdayOpen || "09:00",
    weekdayClose: initialData?.weekdayClose || "21:00",
    weekendOpen: initialData?.weekendOpen || "10:00",
    weekendClose: initialData?.weekendClose || "02:00",
    bufferTime: initialData?.bufferTime || 30,

    amenities: initialData?.amenities || [],

    // IMAGES: Split into Existing (IDs) and New (Files)
    existingImageIds: initialData?.imageIds || [],
    newImages: [], // File Objects for new uploads
  });

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePriceChange = (durationId, value) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [durationId]: value },
    }));
    // Clear error
    if (errors[`price_${durationId}`]) {
      setErrors((prev) => ({ ...prev, [`price_${durationId}`]: null }));
    }
  };

  const toggleDuration = (id) => {
    setFormData((prev) => {
      const exists = prev.offeredDurations.includes(id);
      return {
        ...prev,
        offeredDurations: exists
          ? prev.offeredDurations.filter((d) => d !== id)
          : [...prev.offeredDurations, id],
      };
    });
    if (errors.offeredDurations)
      setErrors((prev) => ({ ...prev, offeredDurations: null }));
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };

  // --- Geolocation Handler ---
  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsLocating(false);
        // Clear location errors if any
        if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
      },
      (error) => {
        alert(
          "Unable to retrieve your location. Please enter manually or allow permissions."
        );
        setIsLocating(false);
      }
    );
  };

  // --- Image Upload Handlers (Click & Drag-Drop) ---

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Filter only images
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...validImages],
    }));
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (id) => {
    setFormData((prev) => ({
      ...prev,
      existingImageIds: prev.existingImageIds.filter((imgId) => imgId !== id),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // Don't trigger upload visual if we are just reordering images
    if (draggedImageIndex !== null) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Don't process file drop if we are reordering
    if (draggedImageIndex !== null) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    // Basic filter to ensure they are images
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validImages],
      }));
      if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // --- Image Reordering Handlers ---

  const handleImageDragStart = (e, index) => {
    setDraggedImageIndex(index);
    // Optional: Set ghost image or effect
  };

  const handleImageItemDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleImageItemDrop = (e, index) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;

    const newImages = [...formData.images];
    const draggedItem = newImages[draggedImageIndex];

    // Remove from old position
    newImages.splice(draggedImageIndex, 1);
    // Insert at new position
    newImages.splice(index, 0, draggedItem);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setDraggedImageIndex(null);
  };

  // --- Validation Logic ---

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.category)
        newErrors.category = "Please select a category vibe.";
      if (!formData.title.trim())
        newErrors.title = "Listing title is required.";
      if (!formData.description.trim())
        newErrors.description = "Description is required.";
      if (formData.maxGuests < 1)
        newErrors.maxGuests = "At least 1 guest required.";
    }

    if (step === 2) {
      if (!formData.address.trim())
        newErrors.address = "Street address is required.";
      if (!formData.city.trim()) newErrors.city = "City is required.";
      if (!formData.state.trim()) newErrors.state = "State is required.";
      // Optional: Require Lat/Long
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = "Please pin your location on the map.";
      }
    }

    if (step === 3) {
      if (formData.offeredDurations.length === 0) {
        newErrors.offeredDurations =
          "Please select at least one duration you offer.";
      } else {
        // Check if price is entered for every selected duration
        formData.offeredDurations.forEach((dur) => {
          if (!formData.prices[dur] || formData.prices[dur] <= 0) {
            newErrors[`price_${dur}`] = "Price is required.";
          }
        });
      }
    }

    if (step === 4) {
      if (!formData.weekdayOpen) newErrors.weekdayOpen = "Required.";
      if (!formData.weekdayClose) newErrors.weekdayClose = "Required.";
      if (!formData.weekendOpen) newErrors.weekendOpen = "Required.";
      if (!formData.weekendClose) newErrors.weekendClose = "Required.";
    }

    if (step === 6) {
      const totalImages =
        formData.existingImageIds.length + formData.newImages.length;
      if (totalImages === 0) {
        newErrors.images = "Please upload at least one image.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // 1. Create FormData object
      const data = new FormData();

      // Basics
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("maxGuests", formData.maxGuests);

      // Location
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("zip", formData.zip);
      data.append("latitude", formData.latitude || "0");
      data.append("longitude", formData.longitude || "0");

      // Schedule
      data.append("weekdayOpen", formData.weekdayOpen);
      data.append("weekdayClose", formData.weekdayClose);
      data.append("weekendOpen", formData.weekendOpen);
      data.append("weekendClose", formData.weekendClose);
      data.append("bufferTime", formData.bufferTime);

      // Pricing (Map the object to flat fields)
      data.append("weekendMultiplier", formData.weekendMultiplier);
      if (formData.prices["1h"]) data.append("price_1h", formData.prices["1h"]);
      if (formData.prices["3h"]) data.append("price_3h", formData.prices["3h"]);
      if (formData.prices["6h"]) data.append("price_6h", formData.prices["6h"]);
      if (formData.prices["12h"])
        data.append("price_12h", formData.prices["12h"]);
      if (formData.prices["24h"])
        data.append("price_24h", formData.prices["24h"]);

      // Amenities (Append loop)
      formData.amenities.forEach((item) => {
        data.append("amenities", item);
      });

      // Always append NEW images
      formData.newImages.forEach((file) => {
        data.append("newImages", file);
      });

      if (isEditMode) {
        // EDIT MODE: Send IDs, UserID, and KEPT Image IDs
        data.append("listingId", initialData.$id);
        data.append("ownerId", initialData.ownerId);
        formData.existingImageIds.forEach((id) =>
          data.append("keptImageIds", id)
        );

        // Call Update Action
        const result = await updateListing(data);
        if (result?.error) throw new Error(result.error);
      } else {
        // CREATE MODE: Standard upload (Server expects 'images' key)
        formData.newImages.forEach((file) => {
          data.append("images", file);
        });

        // Call Create Action
        const result = await createListing(data);
        if (result?.error) {
          alert(result.error);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  // --- Render Steps ---

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What creates the best vibe?{" "}
                <span className="text-red-500">*</span>
              </label>
              {errors.category && (
                <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setFormData({ ...formData, category: cat.id });
                      if (errors.category)
                        setErrors({ ...errors, category: null });
                    }}
                    className={`cursor-pointer border-2 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center transition-all ${
                      formData.category === cat.id
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300"
                    } ${errors.category ? "border-red-300 bg-red-50" : ""}`}
                  >
                    {cat.icon}
                    <span className="font-medium text-sm text-center">
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Studio with High-Speed Wifi"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell guests about your space..."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                min={1}
                className="w-full md:w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Accurate location helps guests find you easily.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.address
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.city
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-black"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.state
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-black"
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            {/* MAP & COORDINATES SECTION */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Pin Location on Map <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleLocationDetect}
                  disabled={isLocating}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isLocating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <LocateFixed className="w-3 h-3" />
                  )}
                  {isLocating ? "Locating..." : "Use Current Location"}
                </button>
              </div>

              {/* Map Placeholder / Container */}
              <div
                className={`w-full h-64 rounded-xl bg-gray-100 border-2 relative overflow-hidden flex flex-col items-center justify-center ${
                  errors.location ? "border-red-500" : "border-gray-200"
                }`}
              >
                {/* If we have coordinates, show them or a visual marker */}
                {formData.latitude && formData.longitude ? (
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                    <p className="text-sm font-medium text-gray-900">
                      Location Pinned!
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.latitude.toFixed(4)},{" "}
                      {formData.longitude.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Map Preview</p>
                    <p className="text-[10px] max-w-[200px] mx-auto mt-2">
                      (Install react-leaflet to render interactive map here)
                    </p>
                  </div>
                )}

                {/* This is where the <Map /> component would go */}
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}

              {/* Hidden Inputs for Form Submission (or visible for debugging) */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
                  Lat: {formData.latitude || "Not set"}
                </div>
                <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
                  Long: {formData.longitude || "Not set"}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Duration Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Which durations do you offer?{" "}
                <span className="text-red-500">*</span>
              </h3>
              {errors.offeredDurations && (
                <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.offeredDurations}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {DURATIONS.map((dur) => {
                  const isSelected = formData.offeredDurations.includes(dur.id);
                  return (
                    <button
                      key={dur.id}
                      onClick={() => toggleDuration(dur.id)}
                      className={`px-4 py-2 rounded-full border transition-colors text-sm md:text-base ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {dur.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Inputs */}
            {formData.offeredDurations.length > 0 && (
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Set your Base Rates <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.offeredDurations.map((durId) => {
                    const label = DURATIONS.find((d) => d.id === durId)?.label;
                    const error = errors[`price_${durId}`];
                    return (
                      <div key={durId}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Price for {label}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            value={formData.prices[durId]}
                            onChange={(e) =>
                              handlePriceChange(durId, e.target.value)
                            }
                            className={`w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:outline-none ${
                              error
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-black"
                            }`}
                          />
                        </div>
                        {error && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weekend Multiplier with Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Weekend Pricing Surge
                </label>
                <span className="text-sm font-bold text-black">
                  {formData.weekendMultiplier}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Slide to increase rates for Saturday & Sunday.
              </p>

              <input
                type="range"
                name="weekendMultiplier"
                min="0"
                max="100"
                step="5"
                value={formData.weekendMultiplier}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />

              {/* Real-time Calculation Preview */}
              {formData.offeredDurations.length > 0 &&
                formData.weekendMultiplier > 0 && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-in fade-in duration-300">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Weekend Rate Preview
                    </h4>
                    <div className="space-y-2">
                      {formData.offeredDurations.map((dur) => {
                        const basePrice = parseInt(formData.prices[dur] || 0);
                        if (!basePrice) return null;
                        const surgedPrice = Math.round(
                          basePrice +
                            (basePrice * formData.weekendMultiplier) / 100
                        );
                        return (
                          <div
                            key={dur}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600 font-medium">
                              {DURATIONS.find((d) => d.id === dur)?.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 line-through text-xs">
                                ₹{basePrice}
                              </span>
                              <span className="text-black font-bold">
                                ₹{surgedPrice}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-gray-500">
              Set your operating hours. Guests cannot book slots outside these
              times.
            </p>

            {/* Weekdays */}
            <div className="border border-gray-200 p-4 md:p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">
                  Weekdays (Mon - Fri)
                </h3>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">
                    Opens At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="weekdayOpen"
                    value={formData.weekdayOpen}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">
                    Closes At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="weekdayClose"
                    value={formData.weekdayClose}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Weekends */}
            <div className="border border-gray-200 p-4 md:p-5 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  Weekends (Sat - Sun)
                </h3>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">
                    Opens At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="weekendOpen"
                    value={formData.weekendOpen}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">
                    Closes At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="weekendClose"
                    value={formData.weekendClose}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    *Set to 02:00 for late night access
                  </p>
                </div>
              </div>
            </div>

            {/* Buffer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cleaning Buffer (Minutes)
              </label>
              <select
                name="bufferTime"
                value={formData.bufferTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="0">None (Instant back-to-back)</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-medium text-gray-900">
              What does your place offer?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {AMENITIES.map((item) => {
                const isSelected = formData.amenities.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelection("amenities", item.id)}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={isSelected ? "text-black" : "text-gray-500"}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isSelected ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Edit Mode: Show Existing Images First */}
            {isEditMode && formData.existingImageIds.length > 0 && (
              <div>
                <h4 className="text-sm font-bold mb-3 text-gray-900">
                  Existing Photos
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {formData.existingImageIds.map((id) => (
                    <div
                      key={id}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <Image
                        fill
                        src={getImageUrl(id)}
                        className="w-full h-full object-cover"
                        alt="existing"
                      />
                      <button
                        onClick={() => removeExistingImage(id)}
                        className="absolute top-1 right-1 bg-white p-1.5 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Uploads (Your Styled Component) */}
            <div>
              <h4 className="text-sm font-bold mb-3 text-gray-900">
                {isEditMode ? "Add More Photos" : "Upload Photos"}
              </h4>

              {errors.images && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-4">
                  <AlertCircle className="w-4 h-4" /> {errors.images}
                </div>
              )}

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all relative ${
                  isDragging
                    ? "border-black bg-blue-50 scale-[1.01]" // Dragging visual feedback
                    : errors.images
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud
                  className={`w-12 h-12 mx-auto mb-3 ${
                    isDragging
                      ? "text-blue-500"
                      : errors.images
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                />
                <p
                  className={`font-medium ${
                    isDragging ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {isDragging ? "Drop photos now" : "Click or Drag photos here"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Upload at least 1 photo
                </p>
              </div>

              {/* Preview Grid with Reordering */}
              {formData.newImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {formData.newImages.map((file, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleImageDragStart(e, index)}
                      onDragOver={handleImageItemDragOver}
                      onDrop={(e) => handleImageItemDrop(e, index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        draggedImageIndex === index
                          ? "opacity-40 border-dashed border-black"
                          : "opacity-100 border-gray-200"
                      } group cursor-move hover:shadow-lg transition-all`}
                      title="Drag to reorder"
                    >
                      <Image
                        fill
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover pointer-events-none"
                      />

                      {/* Cover Label (Only if no existing photos, or if this is first in list) */}
                      {index === 0 &&
                        formData.existingImageIds.length === 0 && (
                          <div className="absolute top-0 left-0 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 font-medium z-10">
                            Cover
                          </div>
                        )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNewImage(index);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>

                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors z-0 pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}

              {formData.newImages.length > 1 && (
                <p className="text-xs text-center text-gray-400 italic mt-2">
                  Drag new images to reorder.
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Stepper (Top Feature) */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between relative">
            {/* The connector line behind the circles */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 md:h-1 bg-gray-200 -z-10" />

            {/* Render Steps */}
            {STEPS.map((step, index) => {
              // Logic: Completed steps are 'finished', Current step is 'active'
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center bg-white px-1 md:px-2"
                >
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors duration-300 ${
                      isActive
                        ? "bg-black text-white ring-2 md:ring-4 ring-gray-100"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {/* Hide inactive labels on mobile to save space */}
                  <span
                    className={`text-[10px] md:text-xs mt-2 font-medium ${
                      isActive ? "text-black" : "hidden sm:block text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            {STEPS[currentStep - 1].label}
          </h2>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-8 md:mt-10 flex justify-between pt-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors ${
                currentStep === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Publish Listing"
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
                className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-black text-white rounded-lg font-medium text-sm md:text-base hover:bg-gray-800 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
