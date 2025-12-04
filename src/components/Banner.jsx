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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReviewCarousel from "./ReviewCarousel";

const FeatureCard = ({ icon: Icon, title, description, benefits }) => (
  <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
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
    <div className="flex flex-col w-full">
      {/* --- HERO SECTION --- */}
      <div className="relative pb-20 lg:pb-32 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold tracking-wide uppercase">
              <Star className="w-3 h-3 fill-amber-700" />
              #1 Hosting Platform in NCR
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
              Your Space. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
                Your Rules.
              </span>{" "}
              <br />
              Your Growth.
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              The smartest way to host in Delhi-NCR with complete transparency.
              Manage bookings, guests, and payments in one premium dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[500px] lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <Image
              src="/house-bgrem.png"
              alt="Luxury Home"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Est. Weekly Revenue
                  </p>
                  <p className="text-xl font-bold text-gray-900">₹45,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <div className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
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
              description="Host with confidence. We ensure every guest provides valid contact details before they can book your property."
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
              description="Focus on hospitality while we handle the logistics. We provide the tools to keep your earnings and property safe."
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
        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              Loved by Hosts across NCR
            </h2>
            <ReviewCarousel />
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
