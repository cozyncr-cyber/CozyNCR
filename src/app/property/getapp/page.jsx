import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DownloadAppSection from "@/components/downloadAppComponent";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col">
      {/* --- 1. Background Decor --- */}
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-rose-50/50 via-white to-transparent pointer-events-none" />

      {/* Background Pattern (Dot Grid) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* --- 2. Navigation / Back Button --- */}
      <div className="relative z-20 px-6 py-8 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.03)] hover:shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* --- 3. Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 relative z-10 -mt-10">
        {/* Header Text */}
        <div className="max-w-3xl w-full text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
            The future of renting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
              is in your pocket.
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Find the perfect space, book instantly on the go. Experience the
            seamless way to rent with CozyNCR on iOS and Android.
          </p>
        </div>

        {/* The Download Component */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <DownloadAppSection />
        </div>
      </main>

      {/* --- 4. Footer Simple --- */}
      <footer className="relative z-10 py-8 text-center text-sm text-gray-400">
        <p>© 2025 CozyNCR. Designed for Guests.</p>
      </footer>
    </div>
  );
}
