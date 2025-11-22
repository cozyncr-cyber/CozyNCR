import {
  ShieldCheck,
  Clock,
  Users,
  ChevronRight,
  MessageSquareText,
  MessageCircle,
  IndianRupee,
  Shield,
  ScanEye,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ReviewCarousel from "./ReviewCarousel";

const Banner = () => {
  return (
    <div className="max-w-7xl flex flex-col md:flex-row w-full mx-auto">
      {/* left corner */}
      <div className="order-2 md:order-1 basis-1/4 flex flex-col justify-between p-4 px-8 md:px-4 gap-4">
        {/* card1 */}
        <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          {/* 1. Header Icon */}
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <ShieldCheck className="text-rose-500 w-6 h-6" />
          </div>

          {/* 2. Title */}
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Your space, your terms
          </h2>

          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            You have full control over who books and how they treat your
            property.
          </p>

          {/* 3. List Items */}
          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <div className="flex gap-3 items-start">
              <Clock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  Check-in Windows
                </p>
                <p className="text-slate-500 text-xs">
                  Set specific times for guest arrival.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3 items-start">
              <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  Guest Limits
                </p>
                <p className="text-slate-500 text-xs">
                  Strictly enforce max occupancy.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Footer / CTA */}
          {/* <div className="mt-6 pt-4 border-t border-slate-100">
            <button className="text-sm font-medium text-slate-900 flex items-center gap-1 hover:underline">
              Edit your preferences <ChevronRight className="w-4 h-4" />
            </button>
          </div> */}
        </div>

        {/* card 2 */}
        <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          {/* 1. Header Icon */}
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <MessageSquareText className="text-rose-500 w-6 h-6" />
          </div>

          {/* 2. Title */}
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Know who you&apos;re hosting
          </h2>

          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Build trust before they arrive. You have the tools to vet potential
            guests and ensure a perfect fit for your property.
          </p>

          {/* 3. List Items */}
          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <div className="flex gap-3 items-start">
              <MessageCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">Chat</p>
                <p className="text-slate-500 text-xs">
                  Message guests to ask questions before accepting a request.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3 items-start">
              <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  Guest insights
                </p>
                <p className="text-slate-500 text-xs">
                  View travel history and past reviews to make informed
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* middle */}
      <div className="order-1 md:order-2 basis-2/4 flex flex-col px-2">
        <Image
          src={"/house-bgrem.png"}
          alt=""
          height={"1000"}
          width={"2000"}
          className="w-fit rounded-lg "
        />

        <div className="my-6 flex flex-col justify-center items-center">
          <p className="text-2xl text-center font-semibold">
            Your Space. Your Terms. Your Growth.
          </p>
          <p className="pt-4 px-4 text-center text-slate-600">
            The smartest way to host in Delhi-NCR with complete transparency and
            control. Your rules, your safety, and your growth—all managed in one
            simple platform.
          </p>
        </div>

        <div className="mt-2">
          <ReviewCarousel />
        </div>
      </div>

      {/* right corner */}
      <div className="order-3 md:order-3 basis-1/4 flex flex-col justify-between p-4 px-8 md:px-4 gap-4">
        {/* card1 */}
        <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          {/* 1. Header Icon */}
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <ShieldCheck className="text-rose-500 w-6 h-6" />
          </div>

          {/* 2. Title */}
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Complete peace of mind
          </h2>

          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            We’ve got your back. You are automatically covered against the
            unexpected at no extra cost to you.
          </p>

          {/* 3. List Items */}
          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <div className="flex gap-3 items-start">
              <IndianRupee className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  INR 20k Liability Cover
                </p>
                <p className="text-slate-500 text-xs">
                  Protection against claims from guests or neighbors.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3 items-start">
              <Shield className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  Damage Protection
                </p>
                <p className="text-slate-500 text-xs">
                  Choose the coverage plan that suits your property&apos;s
                  value.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* card 2 */}
        <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          {/* 1. Header Icon */}
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <MessageSquareText className="text-rose-500 w-6 h-6" />
          </div>

          {/* 2. Title */}
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Unlock the NCR market
          </h2>

          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Get your property in front of the largest network of travelers
            across Delhi, Noida, and Gurgaon.
          </p>

          {/* 3. List Items */}
          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <div className="flex gap-3 items-start">
              <ScanEye className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  Maximum Visibility
                </p>
                <p className="text-slate-500 text-xs">
                  Instant exposure to millions of active users in the capital
                  region.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3 items-start">
              <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  High Demand
                </p>
                <p className="text-slate-500 text-xs">
                  Tap into the high-volume weekend getaway and business traveler
                  market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
