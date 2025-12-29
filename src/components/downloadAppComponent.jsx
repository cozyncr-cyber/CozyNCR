import React from "react";
import Link from "next/link";

export default function DownloadAppSection() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 px-8 py-12 md:p-16">
          {/* --- LEFT CONTENT --- */}
          <div className="text-center md:text-left space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
              Available Now
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Unlock the full <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">
                CozyNCR experience
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
              Get exclusive mobile-only deals, real-time booking updates, and
              browse stays all over India. Your perfect space is just a tap
              away.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              {/* Apple App Store */}
              <Link
                href="#"
                className="group flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95 w-48 justify-center"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.63-.03 3.18 1.09 4.18 1.09 1 .01 2.89-1.35 4.87-1.18 1.65.14 2.87 1.21 3.53 2.17-2.92 1.4-2.44 5.3 1.3 6.53zM15.5 5.5c.81-1.3 2.11-2.02 2.11-2.02-.44 2.18-2.3 3.73-4.33 3.75-.27-2.01 1.41-3.03 2.22-1.73z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold tracking-wider leading-none mb-1 text-gray-500">
                    Download on the
                  </div>
                  <div className="text-sm font-bold leading-none">
                    App Store
                  </div>
                </div>
              </Link>

              {/* Google Play Store */}
              <Link
                href="#"
                className="group flex items-center gap-3 bg-gray-800 text-white border border-gray-700 px-5 py-3 rounded-xl hover:bg-gray-700 transition-all active:scale-95 w-48 justify-center"
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,12.5L17.38,15.69L15.12,13.42L17.38,11.15L20.3,14.34C20.84,15 20.84,15.86 20.3,16.5M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold tracking-wider leading-none mb-1 text-gray-400">
                    Get it on
                  </div>
                  <div className="text-sm font-bold leading-none">
                    Google Play
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Phone Mockup) --- */}
          <div className="flex justify-center md:justify-end relative">
            {/* Phone Frame */}
            <div className="relative w-64 h-[500px] bg-gray-900 border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden z-20 transform md:rotate-[-6deg] hover:rotate-0 transition-all duration-500">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-30"></div>

              {/* Screen Content Placeholder */}
              <div className="w-full h-full bg-white relative">
                {/* Header */}
                <div className="h-16 bg-gray-50 flex items-end pb-3 px-4 justify-between border-b">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <div className="w-20 h-4 rounded-full bg-gray-200"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                </div>
                {/* Content */}
                <div className="p-4 space-y-4">
                  <div className="w-full h-32 rounded-xl bg-gray-100 animate-pulse"></div>
                  <div className="flex gap-3">
                    <div className="w-1/3 h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-1/3 h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-1/3 h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                  </div>
                  <div className="w-full h-12 rounded-lg bg-gray-900 mt-8 opacity-10"></div>
                </div>

                {/* Floating "App" Label */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                  <div className="bg-white/90 p-4 rounded-2xl shadow-lg text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      CozyNCR
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Mobile App</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background element behind phone */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-96 border-2 border-dashed border-gray-700 rounded-[2.5rem] rotate-[6deg] z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
