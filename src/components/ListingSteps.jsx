"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createListing, updateListing } from "@/actions/listings";
import { Country, State, City } from "country-state-city";

// Imports from our new modular files
import { STEPS, DURATIONS } from "./listing-constants";
import {
  StepBasics,
  StepLocation,
  StepPricing,
  StepSchedule,
  StepAmenities,
  StepPhotos,
  Stepper,
} from "./ListingStepComponents";

const getImageUrl = (fileId) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export default function CreateListingPage({ initialData = null }) {
  const isEditMode = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location States
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const selectedCountry = "IN";

  // Drag & Drop States
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setStates(State.getStatesOfCountry(selectedCountry));
  }, []);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",

    // Guest Counts
    maxGuests: initialData?.maxGuests || 1,
    maxChildren: initialData?.maxChildren || 0,
    maxInfants: initialData?.maxInfants || 0,
    maxPets: initialData?.maxPets || 0,

    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",

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
    existingImageIds: initialData?.imageIds || [],
    newImages: [],
  });

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === stateCode);
    setFormData((prev) => ({
      ...prev,
      state: stateObj ? stateObj.name : stateCode,
      city: "",
    }));
    setCities(City.getCitiesOfState(selectedCountry, stateCode));
  };

  const handleCityChange = (e) =>
    setFormData((prev) => ({ ...prev, city: e.target.value }));

  const handlePriceChange = (durationId, value) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [durationId]: value },
    }));
    if (errors[`price_${durationId}`])
      setErrors((prev) => ({ ...prev, [`price_${durationId}`]: null }));
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
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };

  const handleLocationDetect = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setIsLocating(false);
        if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
      },
      () => {
        alert("Unable to retrieve location.");
        setIsLocating(false);
      }
    );
  };

  // --- Image Handlers ---

  const handleNewImageUpload = (e) => {
    const validImages = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...validImages],
    }));
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeNewImage = (index) =>
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  const removeExistingImage = (id) =>
    setFormData((prev) => ({
      ...prev,
      existingImageIds: prev.existingImageIds.filter((imgId) => imgId !== id),
    }));

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedImageIndex === null) setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (draggedImageIndex !== null) return;
    handleNewImageUpload({ target: { files: e.dataTransfer.files } });
  };

  // Reordering
  const handleImageDragStart = (e, index) => setDraggedImageIndex(index);
  const handleImageItemDragOver = (e) => e.preventDefault();
  const handleImageItemDrop = (e, index) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;
    const newImages = [...formData.newImages];
    const item = newImages.splice(draggedImageIndex, 1)[0];
    newImages.splice(index, 0, item);
    setFormData((prev) => ({ ...prev, newImages }));
    setDraggedImageIndex(null);
  };

  // --- Validation ---

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.category)
        newErrors.category = "Please select a category vibe.";
      if (!formData.title.trim())
        newErrors.title = "Listing title is required.";
      if (!formData.description.trim())
        newErrors.description = "Description is required.";
      if (formData.maxGuests < 1)
        newErrors.maxGuests = "At least 1 adult required.";
    }
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required.";
      if (!formData.city.trim()) newErrors.city = "City is required.";
      if (!formData.state.trim()) newErrors.state = "State is required.";
      if (!formData.latitude || !formData.longitude)
        newErrors.location = "Pin your location.";
    }
    if (step === 3) {
      if (formData.offeredDurations.length === 0)
        newErrors.offeredDurations = "Select at least one duration.";
      else
        formData.offeredDurations.forEach((dur) => {
          if (!formData.prices[dur] || formData.prices[dur] <= 0)
            newErrors[`price_${dur}`] = "Price required.";
        });
    }
    if (step === 4) {
      if (
        !formData.weekdayOpen ||
        !formData.weekdayClose ||
        !formData.weekendOpen ||
        !formData.weekendClose
      ) {
        newErrors.weekdayOpen = "All schedule fields are required."; // Generalized error for brevity
      }
    }
    if (step === 6) {
      if (formData.existingImageIds.length + formData.newImages.length === 0)
        newErrors.images = "Upload at least one image.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      // ... Append logic same as before, condensed for brevity ...
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "newImages" ||
          key === "existingImageIds" ||
          key === "amenities" ||
          key === "prices" ||
          key === "offeredDurations"
        )
          return;
        data.append(key, value);
      });
      // Handle special arrays/objects
      formData.amenities.forEach((item) => data.append("amenities", item));
      formData.newImages.forEach((file) =>
        data.append(isEditMode ? "newImages" : "images", file)
      ); // Fix keys
      Object.entries(formData.prices).forEach(([k, v]) => {
        if (v) data.append(`price_${k}`, v);
      });

      if (isEditMode) {
        data.append("listingId", initialData.$id);
        data.append("ownerId", initialData.ownerId);
        formData.existingImageIds.forEach((id) =>
          data.append("keptImageIds", id)
        );
        await updateListing(data);
      } else {
        await createListing(data);
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Stepper steps={STEPS} currentStep={currentStep} />

        <div className="bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            {STEPS[currentStep - 1].label}
          </h2>

          {currentStep === 1 && (
            <StepBasics
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepLocation
              formData={formData}
              handleChange={handleChange}
              handleStateChange={handleStateChange}
              handleCityChange={handleCityChange}
              handleLocationDetect={handleLocationDetect}
              states={states}
              cities={cities}
              isLocating={isLocating}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepPricing
              formData={formData}
              handleChange={handleChange}
              handlePriceChange={handlePriceChange}
              toggleDuration={toggleDuration}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <StepSchedule formData={formData} handleChange={handleChange} />
          )}

          {currentStep === 5 && (
            <StepAmenities
              formData={formData}
              toggleSelection={toggleSelection}
            />
          )}

          {currentStep === 6 && (
            <StepPhotos
              formData={formData}
              isEditMode={isEditMode}
              getImageUrl={getImageUrl}
              removeExistingImage={removeExistingImage}
              removeNewImage={removeNewImage}
              handleNewImageUpload={handleNewImageUpload}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleImageDragStart={handleImageDragStart}
              handleImageItemDragOver={handleImageItemDragOver}
              handleImageItemDrop={handleImageItemDrop}
              isDragging={isDragging}
              draggedImageIndex={draggedImageIndex}
              errors={errors}
            />
          )}

          <div className="mt-8 md:mt-10 flex justify-between pt-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base text-black hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Publish Listing"
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-black text-white rounded-lg font-medium text-sm md:text-base hover:bg-gray-800"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
