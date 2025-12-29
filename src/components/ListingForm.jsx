"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  AlertCircle,
  Search,
  // New Icons for Amenities
  Utensils,
  Wind, // Balcony
  Cigarette,
  Wine,
  Zap, // Power
  Accessibility, // Lift/Accessibility
  ShieldCheck, // Safety
  Speaker,
  Flame, // Fire Extinguisher
  Key, // Private Entrance
  Waves, // Washing Machine? Using Waves for now or generic
  Flower2, // Garden
  BriefcaseMedical, // First Aid
  Users, // Party Friendly
} from "lucide-react";
import { createListing, updateListing } from "@/actions/listings";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { State, City } from "country-state-city";
import { clientStorage, ID } from "@/lib/appwrite-client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const STEPS = [
  { id: 1, label: "The Basics" },
  { id: 2, label: "Location" },
  { id: 3, label: "Pricing & Services" },
  { id: 4, label: "Schedule & Sync" }, // Updated Label
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

// --- UPDATED AMENITIES LIST (20 ITEMS) ---
const AMENITIES = [
  { id: "wifi", label: "Fast Wifi", icon: <Wifi /> },
  { id: "ac", label: "Air Conditioning", icon: <Snowflake /> },
  { id: "tv", label: "Smart TV", icon: <Tv /> },
  { id: "kitchen", label: "Kitchen", icon: <Utensils /> },
  { id: "parking", label: "Parking", icon: <Car /> },
  { id: "desk", label: "Work Desk", icon: <Monitor /> },
  { id: "coffee", label: "Coffee Machine", icon: <Coffee /> },
  { id: "washing_machine", label: "Washing Machine", icon: <Waves /> },
  { id: "lift", label: "Elevator/Lift", icon: <Accessibility /> },
  { id: "power_backup", label: "Power Backup", icon: <Zap /> },
  { id: "balcony", label: "Balcony", icon: <Wind /> },
  { id: "garden", label: "Garden", icon: <Flower2 /> },
  { id: "sound_system", label: "Sound System", icon: <Speaker /> },
  { id: "private_entrance", label: "Private Entrance", icon: <Key /> },
  { id: "first_aid", label: "First Aid Kit", icon: <BriefcaseMedical /> },
  { id: "fire_ext", label: "Fire Extinguisher", icon: <Flame /> },
  { id: "safety", label: "24/7 Security", icon: <ShieldCheck /> },
  // Rules turned into Amenities for filtering
  { id: "smoking", label: "Smoking Allowed", icon: <Cigarette /> },
  { id: "alcohol", label: "Alcohol Allowed", icon: <Wine /> },
  { id: "party", label: "Party Friendly", icon: <Users /> },
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
      <div
        className={`font-medium ${
          disabled ? "text-gray-400" : "text-gray-900"
        }`}
      >
        {label}
      </div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className={`p-2 rounded-full border border-gray-300 transition-colors ${
          value === 0 || disabled
            ? "opacity-30 cursor-not-allowed"
            : "hover:border-black"
        }`}
        disabled={value === 0 || disabled}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span
        className={`w-4 text-center font-medium ${
          disabled ? "text-gray-400" : ""
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={`p-2 rounded-full border border-gray-300 transition-colors ${
          disabled ? "opacity-30 cursor-not-allowed" : "hover:border-black"
        }`}
        disabled={disabled}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const libraries = ["places"];

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

  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    maxGuests: initialData?.maxGuests || 1,
    allowChildren: initialData?.allowChildren ?? true,
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
    addOns: initialData?.addOns ? JSON.parse(initialData.addOns) : [],
    // ICAL URLs state
    icalUrls: initialData?.icalUrls || [],
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

  // --- ICAL HANDLERS ---
  const addIcal = () => {
    if (formData.icalUrls.length >= 10) return;
    setFormData((prev) => ({
      ...prev,
      icalUrls: [...prev.icalUrls, ""],
    }));
  };

  const removeIcal = (index) => {
    setFormData((prev) => ({
      ...prev,
      icalUrls: prev.icalUrls.filter((_, i) => i !== index),
    }));
  };

  const updateIcal = (index, value) => {
    setFormData((prev) => {
      const newUrls = [...prev.icalUrls];
      newUrls[index] = value;
      return { ...prev, icalUrls: newUrls };
    });
  };

  // --- MAP HANDLERS ---
  const onMapLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);
  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: place.formatted_address || prev.address,
      }));

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(17);
      }
      if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
    }
  };

  const onMapClick = useCallback(
    (e) => {
      setFormData((prev) => ({
        ...prev,
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
      }));
      if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
    },
    [errors.location]
  );

  const onMarkerDragEnd = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    }));
  }, []);

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(17);
        }
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
      if (!formData.latitude) newErrors.location = "Please pin location on map";
    }
    if (step === 3) {
      if (formData.offeredDurations.length === 0)
        newErrors.offeredDurations = "Select at least one duration";
      formData.offeredDurations.forEach((d) => {
        if (!formData.prices[d]) newErrors[`price_${d}`] = "Price required";
      });
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

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    try {
      const newImagesToUpload = visualImages.filter(
        (img) => img.type === "new"
      );
      const uploadPromises = newImagesToUpload.map(async (img) => {
        const result = await clientStorage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          ID.unique(),
          img.file
        );
        return { tempId: img.id, realId: result.$id };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      const uploadMap = {};
      uploadedResults.forEach((item) => {
        uploadMap[item.tempId] = item.realId;
      });

      const finalOrderedIds = visualImages
        .map((img) => (img.type === "existing" ? img.id : uploadMap[img.id]))
        .filter(Boolean);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          [
            "amenities",
            "prices",
            "offeredDurations",
            "addOns",
            "icalUrls",
          ].includes(key)
        )
          return;
        data.append(key, formData[key]);
      });

      formData.amenities.forEach((a) => data.append("amenities", a));
      formData.offeredDurations.forEach((d) => {
        if (formData.prices[d]) data.append(`price_${d}`, formData.prices[d]);
      });

      data.append("addOns", JSON.stringify(formData.addOns));
      // Pass valid iCal URLs
      const validIcals = formData.icalUrls.filter(
        (url) => url && url.trim() !== ""
      );
      data.append("icalUrls", JSON.stringify(validIcals));

      data.append("finalImageIds", JSON.stringify(finalOrderedIds));

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

  const renderMapSection = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="h-[300px] bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <h3 className="text-red-800 font-bold mb-1">API Key Missing</h3>
          <p className="text-red-600 text-sm">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
          </p>
        </div>
      );
    }
    if (loadError)
      return (
        <div className="h-[300px] bg-red-50 text-red-600 flex items-center justify-center">
          Map Load Error
        </div>
      );
    if (!isLoaded)
      return (
        <div className="h-[300px] bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );

    return (
      <>
        <div className="mb-4">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search landmark (e.g. India Gate)"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </Autocomplete>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-300">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              formData.latitude && formData.longitude
                ? { lat: formData.latitude, lng: formData.longitude }
                : defaultCenter
            }
            zoom={15}
            onLoad={onMapLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {formData.latitude !== 0 && (
              <Marker
                position={{ lat: formData.latitude, lng: formData.longitude }}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
              />
            )}
          </GoogleMap>
        </div>
      </>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <label className="block text-sm font-medium mb-3">
                Which of these best describes your place?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() =>
                      setFormData({ ...formData, category: cat.id })
                    }
                    className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
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
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black"
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
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black"
                placeholder="Tell guests what makes your place unique..."
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold mb-4">Guest Capacity</h3>
              <Counter
                label="Guests"
                subtitle="Total capacity"
                value={formData.maxGuests}
                onChange={(v) =>
                  setFormData({ ...formData, maxGuests: Math.max(1, v) })
                }
              />
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">
                    Allow Children
                  </div>
                  <div className="text-xs text-gray-500">
                    Is this suitable for children?
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowChildren}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowChildren: e.target.checked,
                      maxInfants: e.target.checked ? formData.maxInfants : 0,
                    })
                  }
                  className="w-5 h-5 accent-black"
                />
              </div>
              <Counter
                label="Infants"
                value={formData.maxInfants}
                disabled={!formData.allowChildren}
                onChange={(v) => setFormData({ ...formData, maxInfants: v })}
              />
              <Counter
                label="Pets"
                value={formData.maxPets}
                onChange={(v) => setFormData({ ...formData, maxPets: v })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in">
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
                  )}{" "}
                  {isLocating ? "Locating..." : "Use Current"}
                </button>
              </div>
              {renderMapSection()}
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <label className="text-sm font-medium block mb-3">
                Select available durations
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => toggleDuration(dur.id)}
                    className={`px-4 py-2 rounded-full border text-sm ${
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
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Extra Services
                </h3>
                <button
                  onClick={addService}
                  className="text-xs flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full"
                >
                  <Plus className="w-3 h-3" /> Add Service
                </button>
              </div>
              <div className="space-y-3">
                {formData.addOns.map((addon, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={addon.name}
                      onChange={(e) =>
                        updateService(index, "name", e.target.value)
                      }
                      className="flex-1 p-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={addon.price}
                      onChange={(e) =>
                        updateService(index, "price", e.target.value)
                      }
                      className="w-32 p-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={() => removeService(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {errors.addon_0 && (
                  <p className="text-red-500 text-xs">Complete services</p>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in">
            {/* WEEKDAY/WEEKEND SCHEDULE - KEEPING THIS BRIEF FOR READABILITY */}
            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Weekdays
              </h3>
              <div className="flex gap-4">
                <input
                  type="time"
                  name="weekdayOpen"
                  value={formData.weekdayOpen}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-lg"
                />
                <input
                  type="time"
                  name="weekdayClose"
                  value={formData.weekdayClose}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-gray-50">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-700">
                <PartyPopper className="w-4 h-4" /> Weekends
              </h3>
              <div className="flex gap-4">
                <input
                  type="time"
                  name="weekendOpen"
                  value={formData.weekendOpen}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-lg"
                />
                <input
                  type="time"
                  name="weekendClose"
                  value={formData.weekendClose}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Cleaning Buffer
              </label>
              <select
                name="bufferTime"
                value={formData.bufferTime}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-white"
              >
                <option value="0">None</option>
                <option value="15">15 Mins</option>
                <option value="30">30 Mins</option>
                <option value="60">1 Hour</option>
              </select>
            </div>

            {/* --- ICAL SECTION --- */}
            <div className="pt-6 border-t mt-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    External Calendars (iCal)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sync availability with Airbnb, Booking.com, etc.
                  </p>
                </div>
                <button
                  onClick={addIcal}
                  disabled={formData.icalUrls.length >= 10}
                  className="text-xs flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Add URL
                </button>
              </div>

              <div className="space-y-3">
                {formData.icalUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://airbnb.com/calendar/ical/..."
                      value={url}
                      onChange={(e) => updateIcal(index, e.target.value)}
                      className="flex-1 p-2 border rounded-lg text-sm font-mono text-gray-600"
                    />
                    <button
                      onClick={() => removeIcal(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.icalUrls.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                    No external calendars linked.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
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
                  <div className={isSelected ? "text-black" : "text-gray-500"}>
                    {item.icon}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      isSelected ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 relative">
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
                    className="relative aspect-square rounded-xl overflow-hidden border group bg-white shadow-sm"
                  >
                    <div className="absolute top-2 left-2 z-10 p-1 bg-black/50 rounded-md text-white cursor-grab">
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
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50"
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
          className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Back
        </button>
        {currentStep === STEPS.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
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
