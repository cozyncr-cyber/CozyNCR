import React from "react";
import { MapPin, Loader2, LocateFixed } from "lucide-react";

export default function StepLocation({
  formData,
  handleChange,
  handleLocationDetect,
  isLocating,
  errors,
}) {
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
          Street Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State / Province
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pin Location on Map
          </label>
          <button
            onClick={handleLocationDetect}
            disabled={isLocating}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <LocateFixed className="w-3 h-3" />
            )}
            {isLocating ? "Locating..." : "Use Current Location"}
          </button>
        </div>

        <div
          className={`w-full h-64 rounded-xl bg-gray-100 border-2 relative flex flex-col items-center justify-center ${
            errors.location ? "border-red-500" : "border-gray-200"
          }`}
        >
          {formData.latitude && formData.longitude ? (
            <div className="text-center">
              <MapPin className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-medium text-gray-900">
                Location Pinned!
              </p>
              <p className="text-xs text-gray-500">
                {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Map Preview</p>
            </div>
          )}
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
    </div>
  );
}
