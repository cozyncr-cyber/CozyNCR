import React from "react";
import { AlertCircle } from "lucide-react";
import { CATEGORIES } from "./constants";

export default function StepBasics({
  formData,
  setFormData,
  handleChange,
  errors,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What creates the best vibe? <span className="text-red-500">*</span>
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
                setFormData((prev) => ({ ...prev, category: cat.id }));
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
          Listing Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Guests
        </label>
        <input
          type="number"
          name="maxGuests"
          value={formData.maxGuests}
          onChange={handleChange}
          min={1}
          className="w-full md:w-32 p-3 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
}
