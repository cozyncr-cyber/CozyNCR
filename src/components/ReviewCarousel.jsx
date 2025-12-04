"use client"; // Required for useState and useEffect

import React, { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "South Delhi",
    rating: 5,
    text: "The villa was absolutely stunning. The host was incredibly responsive, and the amenities were exactly as described. Perfect weekend getaway for our family.",
    date: "December 2025",
  },
  {
    id: 2,
    name: "Priya Kapoor",
    location: "Gurgaon",
    rating: 5,
    text: "I've used many rental platforms, but the transparency here is unmatched. I loved the pre-booking chat feature—it made me feel so much more secure.",
    date: "December 2025",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    location: "Noida",
    rating: 4,
    text: "Seamless check-in and the property was spotless. The liability protection gave me peace of mind. Highly recommend for short stays in NCR.",
    date: "December 2025",
  },
];

const ReviewCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center bg-slate-100 text-black rounded-2xl p-8 relative overflow-hidden">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800/10 rotate-180" />

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full flex-shrink-0 px-1">
              <div className="flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-600">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* User Info */}
                <div className="mt-2">
                  <p className="font-bold text-slate-600">{review.name}</p>
                  <p className="text-sm text-slate-400">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-black" : "w-2 bg-slate-600"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
