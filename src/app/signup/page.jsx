import SignupForm from "@/components/SignupForm";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 xl:p-16 relative z-10 overflow-y-auto max-h-screen no-scrollbar">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 w-fit group mb-10">
          <Home
            className="text-amber-600 transition-transform group-hover:scale-110"
            size={28}
          />
          <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Cozy<span className="text-gray-900">NCR</span>
          </span>
        </Link>

        <div className="flex-1 flex items-center justify-center w-full max-w-lg mx-auto">
          <SignupForm />
        </div>
      </div>

      {/* Right: Hero Image Section */}
      <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden fixed right-0 top-0 bottom-0 h-screen">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src="/homeimage.jpg"
          alt="Modern Home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Start your hosting journey today.
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-8">
              Join a community of 500+ hosts in Delhi-NCR who are earning more
              and worrying less with our premium tools.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <span className="text-2xl font-bold text-white">Zero</span>
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Listing Fees
                </span>
              </div>
              <div className="flex flex-col bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Host Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
