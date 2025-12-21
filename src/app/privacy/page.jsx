"use client";

import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const sections = [
  {
    id: 1,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information Provided by Users",
        items: [
          "Full name",
          "Phone number",
          "Email address",
          "Gender (optional)",
          "Date of birth (optional)",
          "Identity verification documents (PAN, Aadhaar, Passport, Driving License)",
          "Profile photos",
        ],
      },
      {
        subtitle: "Booking & Host Information",
        items: [
          "Property details",
          "Photos and videos of listings",
          "Pricing and availability",
          "Guest reviews",
          "Booking dates and history",
        ],
      },
      {
        subtitle: "Payment & Financial Information",
        items: [
          "UPI ID",
          "Bank account details (only for hosts)",
          "Payment history",
          "Transaction IDs",
          "Note: We do NOT store full card numbers. All payments are handled by secure third-party gateways.",
        ],
      },
      {
        subtitle: "Device & Technical Data",
        items: [
          "IP address",
          "Device model",
          "OS version",
          "App version",
          "Device identifiers",
          "Crash logs",
          "Cookies and tracking technologies",
        ],
      },
      {
        subtitle: "Location Data",
        items: [
          "Approximate or precise location (only with user permission)",
          "Location of listed properties",
        ],
      },
      {
        subtitle: "Automatically Collected Usage Data",
        items: [
          "Pages viewed",
          "Buttons clicked",
          "Search history",
          "Time spent on pages",
          "Referring URLs",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "How We Use Your Information",
    content: [
      {
        items: [
          "Provide, maintain & improve the Platform",
          "Facilitate bookings between guests and hosts",
          "Verify user identity",
          "Prevent fraud, scams & illegal activities",
          "Process payments & refunds",
          "Customize user experience",
          "Provide customer support",
          "Send important notifications & updates",
          "Comply with law enforcement and regulatory requirements",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Legal Bases for Processing",
    content: [
      {
        items: [
          "User Consent",
          "Performance of Contract (providing bookings)",
          "Legitimate Interests (security, fraud prevention, analytics)",
          "Legal Obligations (tax, verification, criminal complaints)",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Sharing of Information",
    content: [
      {
        subtitle: "Verified Third-Party Service Providers",
        items: [
          "Payment processors (UPI, Razorpay, Stripe, etc.)",
          "Cloud hosting (AWS, Google Cloud, etc.)",
          "SMS/Email OTP service providers",
          "Analytics partners",
        ],
      },
      {
        subtitle: "Hosts & Guests",
        items: ["To complete bookings"],
      },
      {
        subtitle: "Law Enforcement",
        items: [
          "When legally required or in cases of: Fraud, Abuse, Criminal activity, Court orders",
        ],
      },
      {
        subtitle: "Business Transfers",
        items: [
          "If CozyNCR is acquired or merged, user data may be transferred securely.",
        ],
      },
      {
        items: ["We DO NOT sell user data to third parties."],
      },
    ],
  },
  {
    id: 5,
    title: "Data Security Measures",
    content: [
      {
        items: [
          "AES-256 encryption",
          "HTTPS/SSL security",
          "Secure cloud storage",
          "Limited employee access",
          "Two-step admin verification",
          "Regular security audits",
          "Real-time fraud detection systems",
          "No method of transmission is 100% secure, but we follow global best practices to protect your data.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Data Retention",
    content: [
      {
        text: "We keep user data only as long as necessary for:",
        items: [
          "Providing services",
          "Legal compliance",
          "Audit / tax requirements",
          "Security & dispute resolution",
          "Users may request deletion anytime (unless required by law to retain).",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "International Data Transfers",
    content: [
      {
        text: "Your data may be transferred to servers located outside India (e.g., Singapore, US, EU) depending on where our service providers are hosted. We ensure that all transfers comply with global privacy regulations and secure-transfer agreements.",
      },
    ],
  },
  {
    id: 8,
    title: "User Rights",
    content: [
      {
        text: "You may:",
        items: [
          "Access your data",
          "Correct inaccurate information",
          "Request deletion",
          "Request restriction of processing",
          "Withdraw consent",
          "Request a copy of your data",
          "Requests can be made via ncrcozy@gmail.com",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Cookies & Tracking",
    content: [
      {
        text: "We use cookies and similar technologies for:",
        items: [
          "Authentication",
          "Security",
          "Analytics",
          "Personalization",
          "Improving app performance",
          "Users may disable cookies, but some features may not function properly.",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Children's Privacy",
    content: [
      {
        text: "Our Platform is not intended for users under 18. We do not knowingly collect data from minors.",
      },
    ],
  },
  {
    id: 11,
    title: "Third-Party Links",
    content: [
      {
        text: "CozyNCR may contain links to external websites. We are not responsible for their content or privacy practices.",
      },
    ],
  },
  {
    id: 12,
    title: "Fraud Prevention & Safety",
    content: [
      {
        text: "We may use automated systems and manual checks to:",
        items: [
          "Detect suspicious behavior",
          "Block fraudulent users",
          "Verify identity documents",
          "Track illegal activities",
          "Fraudulent users may be permanently barred and reported to authorities.",
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Notifications & Communication",
    content: [
      {
        text: "We may send:",
        items: [
          "Transactional SMS",
          "OTPs",
          "Security alerts",
          "Policy updates",
          "Promotional messages (with opt-out option)",
        ],
      },
    ],
  },
  {
    id: 14,
    title: "Dispute Resolution",
    content: [
      {
        text: "All disputes will be handled under the jurisdiction of courts in Noida, Uttar Pradesh.",
      },
    ],
  },
  {
    id: 15,
    title: "Changes to This Policy",
    content: [
      {
        text: "We may update this Privacy Policy from time to time. Continued use of the Platform after updates means acceptance of the new terms.",
      },
    ],
  },
];

const Section = ({ section, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => onToggle(section.id)}
        className="w-full flex items-center justify-between py-5 text-left group transition-colors hover:bg-gray-50/50 px-2 rounded-lg"
      >
        <span className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-black">
          {section.title}
        </span>
        <div
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2">
          {section.content.map((block, idx) => (
            <div key={idx} className="mt-3 first:mt-0">
              {block.subtitle && (
                <h4 className="font-semibold text-gray-900 mb-2">
                  {block.subtitle}
                </h4>
              )}
              {block.text && (
                <p className="mb-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {block.text}
                </p>
              )}
              {block.items && (
                <ul className="ml-2 space-y-2">
                  {block.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-gray-400 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0 block" />
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            CozyNCR
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Privacy Policy
          </p>
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-gray-900">Owners:</span> Sagar
              Soni & Shreyansh Gupta
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              CozyNCR (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
              committed to protecting the privacy of individuals who use our
              mobile application, website, and related services (collectively,
              the &quot;Platform&quot;). This Privacy Policy explains how we
              collect, use, store, protect, share, and process your personal
              information.
            </p>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              By accessing or using CozyNCR, you agree to the collection and use
              of your information in accordance with this Privacy Policy.
            </p>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-1">
          {sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              isExpanded={!!expandedSections[section.id]}
              onToggle={toggleSection}
            />
          ))}
        </div>

        {/* Grievance Officer Section */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Grievance Officer
          </h2>
          <p className="text-sm text-gray-500 mb-6">Required by Indian Law</p>

          <div className="space-y-4">
            <a
              href="mailto:ncrcozy@gmail.com"
              className="flex items-center group transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </div>
              <span className="ml-3 text-sm font-medium text-blue-600 hover:underline">
                ncrcozy@gmail.com
              </span>
            </a>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
              </div>
              <span className="ml-3 text-sm text-gray-700">
                Noida, Uttar Pradesh
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center space-y-2">
          <p className="text-xs text-gray-400">Last Updated: December 2025</p>
          <p className="text-xs text-gray-400">
            © 2025 CozyNCR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
