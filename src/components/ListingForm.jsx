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
  Loader2,
  Minus,
  Plus,
  GripVertical,
  Trash2,
} from "lucide-react";
import { createListing, updateListing } from "@/actions/listings";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { State, City } from "country-state-city";
// Import the Client SDK helper we created
import { clientStorage, ID } from "@/lib/appwrite-client";

// --- CONSTANTS ---
const STEPS = [
  { id: 1, label: "The Basics" },
  { id: 2, label: "Location" },
  { id: 3, label: "Pricing & Services" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Amenities" },
  { id: 6, label: "Photos" },
];

const CATEGORIES = [
  {
    id: "apartment",
    label: "Apartment",
    icon: <Home className="w-6 h-6 mb-2" />,
  },
  {
    id: "studio",
    label: "Studio",
    icon: <Armchair className="w-6 h-6 mb-2" />,
  },
  {
    id: "hall",
    label: "Event Hall",
    icon: <PartyPopper className="w-6 h-6 mb-2" />,
  },
  { id: "villa", label: "Villa", icon: <Castle className="w-6 h-6 mb-2" /> },
  {
    id: "office",
    label: "Office/Pod",
    icon: <Briefcase className="w-6 h-6 mb-2" />,
  },
  {
    id: "jamroom",
    label: "Jam Room",
    icon: <Music className="w-6 h-6 mb-2" />,
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
  { id: "3h", label: "3 Hours" },
  { id: "6h", label: "6 Hours" },
  { id: "12h", label: "12 Hours" },
  { id: "24h", label: "24 Hours" },
];

const getImageUrl = (fileId) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

const Counter = ({ label, value, onChange, subtitle, disabled = false }) => (
  <div className="flex items-center justify-between py-4 border-b last:border-0">
    <div>
      <div className={`font-medium ${disabled ? "text-gray-400" : "text-gray-900"}`}>{label}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className={`p-2 rounded-full border border-gray-300 transition-colors ${
          value === 0 || disabled
            ? "opacity-30 cursor-not-allowed border-gray-200"
            : "hover:border-black"
        }`}
        disabled={value === 0 || disabled}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className={`w-4 text-center font-medium ${disabled ? "text-gray-400" : ""}`}>{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={`p-2 rounded-full border border-gray-300 transition-colors ${
          disabled ? "opacity-30 cursor-not-allowed border-gray-200" : "hover:border-black"
        }`}
        disabled={disabled}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default function CreateListingForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const selectedCountry = "IN";

  const [visualImages, setVisualImages] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",

    // Guest Counts
    maxGuests: initialData?.maxGuests || 1, // Adults
    allowChildren: initialData?.allowChildren ?? true, // Default true if not set
    maxInfants: initialData?.maxInfants || 0,
    maxPets: initialData?.maxPets || 0,

    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,

    offeredDurations: initialData
      ? DURATIONS.map((d) => d.id).filter((id) => initialData[`price_${id}`])
      : [],
    prices: {
      "1h": initialData?.price_1h || "",
      "3h": initialData?.price_3h || "",
      "6h": initialData?.price_6h || "",
      "12h": initialData?.price_12h || "",
      "24h": initialData?.price_24h || "",
    },
    weekendMultiplier: initialData?.weekendMultiplier || 0,

    // Add-on Services: array of { name, price }
    addOns: initialData?.addOns ? JSON.parse(initialData.addOns) : [],

    weekdayOpen: initialData?.weekdayOpen || "09:00",
    weekdayClose: initialData?.weekdayClose || "21:00",
    weekendOpen: initialData?.weekendOpen || "10:00",
    weekendClose: initialData?.weekendClose || "02:00",
    bufferTime: initialData?.bufferTime || 30,
    amenities: initialData?.amenities || [],
  });

  useEffect(() => {
    const statesData = State.getStatesOfCountry(selectedCountry);
    setStates(statesData);

    if (initialData?.imageIds) {
      const existing = initialData.imageIds.map((id) => ({
        id: id,
        type: "existing",
        url: getImageUrl(id),
      }));
      setVisualImages(existing);
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.state) {
      const stateObj = states.find(
        (s) => s.name === formData.state || s.isoCode === formData.state
      );
      if (stateObj) {
        const cityData = City.getCitiesOfState(
          selectedCountry,
          stateObj.isoCode
        );
        setCities(cityData);
      }
    }
  }, [formData.state, states]);

  // --- HANDLERS ---
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === stateCode);
    setFormData((prev) => ({
      ...prev,
      state: stateObj ? stateObj.name : "",
      city: "",
    }));
  };

  const handleCityChange = (e) =>
    setFormData((prev) => ({ ...prev, city: e.target.value }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePriceChange = (durationId, value) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [durationId]: value },
    }));
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

  // --- ADD-ON SERVICES LOGIC ---
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      addOns: [...prev.addOns, { name: "", price: "" }],
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index, field, value) => {
    setFormData((prev) => {
      const newAddOns = [...prev.addOns];
      newAddOns[index][field] = value;
      return { ...prev, addOns: newAddOns };
    });
  };

  // --- LOCATION & IMAGE LOGIC ---
  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
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
        if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
      },
      () => {
        alert("Unable to retrieve location");
        setIsLocating(false);
      }
    );
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    const newItems = validFiles.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      type: "new",
      url: URL.createObjectURL(file),
      file: file,
    }));
    setVisualImages((prev) => [...prev, ...newItems]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeImage = (index) =>
    setVisualImages((prev) => prev.filter((_, i) => i !== index));
    
  const onDragStart = (index) => setDraggedItemIndex(index);
  
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    setVisualImages((prev) => {
      const newList = [...prev];
      const item = newList[draggedItemIndex];
      newList.splice(draggedItemIndex, 1);
      newList.splice(index, 0, item);
      return newList;
    });
    setDraggedItemIndex(index);
  };
  
  const onDragEnd = () => setDraggedItemIndex(null);

  // --- SUBMISSION ---
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.description)
        newErrors.description = "Description is required";
    }
    if (step === 2) {
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.latitude) newErrors.location = "Pin location required";
    }
    if (step === 3) {
      if (formData.offeredDurations.length === 0)
        newErrors.offeredDurations = "Select at least one duration";
      formData.offeredDurations.forEach((d) => {
        if (!formData.prices[d]) newErrors[`price_${d}`] = "Price required";
      });
      // Validate Addons
      formData.addOns.forEach((addon, i) => {
        if (!addon.name || !addon.price)
          newErrors[`addon_${i}`] = "Complete service details";
      });
    }
    if (step === 6) {
      if (visualImages.length === 0)
        newErrors.images = "At least one photo required";
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

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- UPDATED HANDLESUBMIT (Client Upload Strategy) ---
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    try {
      // 1. Filter out only the NEW images that need uploading
      const newImagesToUpload = visualImages.filter((img) => img.type === "new");

      // 2. Upload them and create a map: { temp_id: real_appwrite_id }
      // This happens on the CLIENT, so no server size limits apply
      const uploadPromises = newImagesToUpload.map(async (img) => {
        try {
            const result = await clientStorage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                img.file
            );
            return { tempId: img.id, realId: result.$id };
        } catch (uploadError) {
            console.error("Upload failed for file:", img.file.name, uploadError);
            throw new Error(`Failed to upload ${img.file.name}. Please try again.`);
        }
      });

      const uploadedResults = await Promise.all(uploadPromises);

      // Create a lookup object for easy replacement
      const uploadMap = {};
      uploadedResults.forEach((item) => {
        uploadMap[item.tempId] = item.realId;
      });

      // 3. Construct the Final Ordered Array of IDs
      // We iterate through 'visualImages' because that array IS the current visual order
      const finalOrderedIds = visualImages.map((img) => {
        if (img.type === "existing") {
          return img.id; // Keep existing real ID
        } else {
          return uploadMap[img.id]; // Swap temp ID for new real ID
        }
      }).filter(Boolean); // Safety filter

      // 4. Construct FormData for the Server Action
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (["amenities", "prices", "offeredDurations", "addOns"].includes(key))
          return;
        data.append(key, formData[key]);
      });

      formData.amenities.forEach((a) => data.append("amenities", a));
      formData.offeredDurations.forEach((d) => {
        if (formData.prices[d]) data.append(`price_${d}`, formData.prices[d]);
      });

      data.append("addOns", JSON.stringify(formData.addOns));
      
      // KEY CHANGE: Send the clean, ordered array of IDs
      data.append("finalImageIds", JSON.stringify(finalOrderedIds));
      
      // We do NOT send "newImages" or "finalImageOrder" anymore

      if (isEditMode) {
        data.append("listingId", initialData.$id);
        const result = await updateListing(data);
        if (result.error) throw new Error(result.error);
      } else {
        const result = await createListing(data);
        if (result.error) throw new Error(result.error);
      }
      
      router.push("/properties");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong during submission.");
      setIsSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in">
            {/* Category & Details */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Which of these best describes your place?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setFormData({ ...formData, category: cat.id });
                    }}
                    className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-black ${
                      formData.category === cat.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    {cat.icon}
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                placeholder="e.g. Cozy Studio in Downtown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                placeholder="Tell guests what makes your place unique..."
              />
            </div>

            {/* UPDATED GUEST COUNTERS */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold mb-4">Guest Capacity & Rules</h3>

              {/* Merged Adults & Children */}
              <Counter
                label="Guests"
                subtitle="Total capacity (Adults + Children)"
                value={formData.maxGuests}
                onChange={(v) =>
                  setFormData({ ...formData, maxGuests: Math.max(1, v) })
                }
              />

              {/* Children Allowed Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">
                    Allow Children
                  </div>
                  <div className="text-xs text-gray-500">
                    Is this property suitable for children (2-12)?
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.allowChildren}
                    onChange={(e) => {
                      const isAllowed = e.target.checked;
                      setFormData({
                        ...formData,
                        allowChildren: isAllowed,
                        // If children not allowed, reset infants to 0
                        maxInfants: isAllowed ? formData.maxInfants : 0,
                      });
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <Counter
                label="Infants"
                subtitle="Under 2"
                value={formData.maxInfants}
                // Disable infant counter if children are not allowed
                disabled={!formData.allowChildren}
                onChange={(v) => setFormData({ ...formData, maxInfants: v })}
              />
              <Counter
                label="Pets"
                subtitle="Service animals allowed"
                value={formData.maxPets}
                onChange={(v) => setFormData({ ...formData, maxPets: v })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in">
            {/* Location Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  name="state"
                  onChange={handleStateChange}
                  className="w-full p-3 border rounded-xl bg-white"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option
                      key={s.isoCode}
                      value={s.isoCode}
                      selected={formData.state === s.name}
                    >
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.state}
                  className="w-full p-3 border rounded-xl bg-white disabled:bg-gray-100"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium">Pin Location</label>
                <button
                  onClick={handleLocationDetect}
                  disabled={isLocating}
                  className="text-xs bg-black text-white px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                  {isLocating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                  {isLocating ? "Locating..." : "Use Current Location"}
                </button>
              </div>
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                {formData.latitude ? (
                  <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Location Pinned (
                    {formData.latitude.toFixed(4)},{" "}
                    {formData.longitude.toFixed(4)})
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">
                    Your coordinates (We use this for accurate navigation)
                  </span>
                )}
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in">
            <label className="text-center text-sm font-medium block mb-3 text-slate-600">
              We charge 10%, 90% goes to you
            </label>
            {/* Durations */}
            <div>
              <label className="text-sm font-medium block mb-3">
                Select available durations
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => toggleDuration(dur.id)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      formData.offeredDurations.includes(dur.id)
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
              {errors.offeredDurations && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.offeredDurations}
                </p>
              )}
            </div>

            {formData.offeredDurations.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DURATIONS.filter((d) =>
                  formData.offeredDurations.includes(d.id)
                ).map((dur) => (
                  <div key={dur.id}>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      {dur.label} Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.prices[dur.id]}
                      onChange={(e) =>
                        handlePriceChange(dur.id, e.target.value)
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                    {errors[`price_${dur.id}`] && (
                      <p className="text-red-500 text-[10px]">
                        {errors[`price_${dur.id}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Weekend Surge */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Weekend Price Surge
                </label>
                <span className="font-bold">{formData.weekendMultiplier}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.weekendMultiplier}
                onChange={handleChange}
                name="weekendMultiplier"
                className="w-full accent-black"
              />
            </div>

            {/* NEW ADD-ON SERVICES */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Extra Services
                  </h3>
                  <p className="text-xs text-gray-500">
                    Offer add-ons like decorations, cake, or photography.
                  </p>
                </div>
                <button
                  onClick={addService}
                  className="text-xs flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800"
                >
                  <Plus className="w-3 h-3" /> Add Service
                </button>
              </div>

              <div className="space-y-3">
                {formData.addOns.map((addon, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Service Name (e.g. Birthday Decor)"
                        value={addon.name}
                        onChange={(e) =>
                          updateService(index, "name", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={addon.price}
                        onChange={(e) =>
                          updateService(index, "price", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeService(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.addOns.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
                    No extra services added yet.
                  </p>
                )}
                {errors.addon_0 && (
                  <p className="text-red-500 text-xs">
                    Please complete all service fields.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          // Schedule - Unchanged
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Weekdays (Mon-Fri)
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Open</label>
                  <input
                    type="time"
                    name="weekdayOpen"
                    value={formData.weekdayOpen}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Close</label>
                  <input
                    type="time"
                    name="weekdayClose"
                    value={formData.weekdayClose}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-gray-50">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-700">
                <PartyPopper className="w-4 h-4" /> Weekends (Sat-Sun)
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Open</label>
                  <input
                    type="time"
                    name="weekendOpen"
                    value={formData.weekendOpen}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Close</label>
                  <input
                    type="time"
                    name="weekendClose"
                    value={formData.weekendClose}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Cleaning Buffer (Minutes)
              </label>
              <select
                name="bufferTime"
                value={formData.bufferTime}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-white"
              >
                <option value="0">None</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          // Amenities - Unchanged
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in">
            {AMENITIES.map((item) => {
              const isSelected = formData.amenities.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelection("amenities", item.id)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm mt-2 font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        );
      case 6:
        return (
          // Photos - Unchanged logic
          <div className="space-y-6 animate-in fade-in">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="font-medium">Click or drag photos here</p>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm font-medium text-center">
                {errors.images}
              </p>
            )}
            {visualImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {visualImages.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={onDragEnd}
                    className={`relative aspect-square rounded-xl overflow-hidden border group bg-white shadow-sm transition-transform ${
                      draggedItemIndex === index
                        ? "scale-105 shadow-lg ring-2 ring-black z-10"
                        : ""
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10 p-1 bg-black/50 rounded-md text-white cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <Image
                      src={img.url}
                      fill
                      alt="listing"
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold text-center py-1">
                        COVER PHOTO
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <div className="flex justify-between mb-2 px-4">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full flex-1 mx-1 transition-all ${
                currentStep >= s.id ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-4 px-4">
          {STEPS[currentStep - 1].label}
        </h2>
      </div>
      <div className="bg-white p-4 rounded-md min-h-[400px]">
        {renderStepContent()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:bg-transparent md:border-0 md:p-0 md:mt-8 flex justify-between z-20">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {currentStep === STEPS.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Publish Listing"}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}