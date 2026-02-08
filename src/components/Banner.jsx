"use client";
import {
  ShieldCheck,
  Clock,
  Users,
  MessageSquareText,
  ScanEye,
  IndianRupee,
  Star,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  CalendarCheck,
  ShieldCheckIcon,
  Shield,
  IndianRupeeIcon,
  FileText,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReviewCarousel from "./ReviewCarousel";

const FeatureCard = ({ icon: Icon, title, description, benefits }) => (
  <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors group-hover:scale-110 duration-300">
      <Icon className="text-amber-600 w-6 h-6" />
    </div>
    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>

    <div className="space-y-3 pt-6 border-t border-gray-50">
      {benefits.map((benefit, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="mt-1 bg-gray-100 p-0.5 rounded-full">
            <benefit.icon className="w-3 h-3 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
            <p className="text-xs text-gray-500">{benefit.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Banner = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Inline Styles for specific animations not in Tailwind default */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes shine {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .text-shine {
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="relative pb-20 lg:pb-32 px-6 max-w-7xl mx-auto w-full pt-10">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-rose-200 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-amber-100 rounded-full text-amber-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Star className="w-3 h-3 fill-amber-700" />
              #1 Hosting Platform in NCR
            </div>

            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
              Your Space. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-800 text-shine">
                Your Rules.
              </span>{" "}
              <br />
              Your Growth.
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              The smartest way to host in Delhi-NCR. Manage bookings, guests,
              and payments in one premium dashboard designed for owners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-gray-900/30 hover:-translate-y-1 group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* App Download Section */}
            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Guest? Download the App
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* App Store Button (Small) */}
                <a
                  href="#"
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.63-.03 3.18 1.09 4.18 1.09 1 .01 2.89-1.35 4.87-1.18 1.65.14 2.87 1.21 3.53 2.17-2.92 1.4-2.44 5.3 1.3 6.53zM15.5 5.5c.81-1.3 2.11-2.02 2.11-2.02-.44 2.18-2.3 3.73-4.33 3.75-.27-2.01 1.41-3.03 2.22-1.73z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[8px] uppercase font-bold leading-none text-gray-300">
                      Download on
                    </div>
                    <div className="text-xs font-bold leading-none">
                      App Store
                    </div>
                  </div>
                </a>

                {/* Play Store Button (Small) */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.cozyncr.cozyncr"
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,12.5L17.38,15.69L15.12,13.42L17.38,11.15L20.3,14.34C20.84,15 20.84,15.86 20.3,16.5M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[8px] uppercase font-bold leading-none text-gray-300">
                      Get it on
                    </div>
                    <div className="text-xs font-bold leading-none">
                      Google Play
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Image (3D Floating Effect) */}
          <div className="relative perspective-container">
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl animate-float transition-transform duration-500 ease-out hover:scale-[1.02]">
              <Image
                src="/house-bgrem.png"
                alt="Luxury Home"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Card 1: Revenue */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Est. Weekly Revenue
                    </p>
                    <p className="text-xl font-bold text-gray-900">₹45,000+</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Status (New) */}
              <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-800">
                  Live in NCR
                </span>
              </div>
            </div>

            {/* Decorative blob behind image */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-gradient-to-tr from-amber-200 to-rose-200 rounded-[3rem] blur-3xl opacity-40"></div>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <div className="bg-gray-50 py-24 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Hosting made simple
            </h2>
            <p className="text-gray-500">
              We provide the tools you need to list, manage, and grow your
              property business without the headache.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Control */}
            <FeatureCard
              icon={ShieldCheck}
              title="Complete Control"
              description="You define the rules. Our platform gives you granular control over every aspect of your listing."
              benefits={[
                {
                  icon: Clock,
                  title: "Smart Scheduling",
                  desc: "Set custom check-in windows.",
                },
                {
                  icon: Users,
                  title: "Occupancy Limits",
                  desc: "Strictly enforce guest counts.",
                },
              ]}
            />

            {/* Card 2: Vetting */}
            <FeatureCard
              icon={UserCheck}
              title="Trusted Community"
              description="Host with confidence. We ensure every guest provides valid contact details before they can book."
              benefits={[
                {
                  icon: CalendarCheck,
                  title: "Booking Control",
                  desc: "Review requests first.",
                },
                {
                  icon: ShieldCheckIcon,
                  title: "Verified Accounts",
                  desc: "Phone & email checks.",
                },
              ]}
            />

            {/* Card 3: Protection */}
            <FeatureCard
              icon={Shield}
              title="Secure Hosting"
              description="Focus on hospitality while we handle the logistics. Tools to keep your earnings and property safe."
              benefits={[
                {
                  icon: IndianRupeeIcon,
                  title: "Secure Payments",
                  desc: "Guaranteed on-time payouts.",
                },
                {
                  icon: FileText,
                  title: "House Rules",
                  desc: "Set strict guest guidelines.",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* --- REVIEW SECTION --- */}
      <div className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              Loved by Hosts across NCR
            </h2>
            <ReviewCarousel />
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
