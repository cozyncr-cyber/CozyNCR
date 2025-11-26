import React from "react";
import { AlertCircle } from "lucide-react";
import { DURATIONS } from "./constants";

export default function StepPricing({
  formData,
  handleChange,
  handlePriceChange,
  toggleDuration,
  errors,
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Which durations do you offer?
        </h3>
        {errors.offeredDurations && (
          <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.offeredDurations}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {DURATIONS.map((dur) => (
            <button
              key={dur.id}
              onClick={() => toggleDuration(dur.id)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                formData.offeredDurations.includes(dur.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {formData.offeredDurations.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Set your Base Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.offeredDurations.map((durId) => {
              const label = DURATIONS.find((d) => d.id === durId)?.label;
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
                      onChange={(e) => handlePriceChange(durId, e.target.value)}
                      className={`w-full pl-8 p-2 border rounded-lg ${
                        errors[`price_${durId}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Weekend Pricing Surge
          </label>
          <span className="text-sm font-bold text-black">
            {formData.weekendMultiplier}%
          </span>
        </div>
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
      </div>
    </div>
  );
}
