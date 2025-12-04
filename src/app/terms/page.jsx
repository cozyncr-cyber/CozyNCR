import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Cozy NCR",
  description: "Terms and conditions for using the Cozy NCR platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-sm font-bold text-gray-900">Cozy NCR</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-500">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-12 leading-relaxed">
          {/* Intro */}
          <div className="bg-gray-50 p-6 rounded-2xl text-sm border border-gray-100">
            <p className="font-medium text-gray-900 mb-0">
              Welcome to Cozy NCR (&quot;App&quot;, &quot;We&quot;,
              &quot;Us&quot;). By using our platform, services, website, or
              mobile app, you (&quot;User&quot;, &quot;Guest&quot;,
              &quot;Host&quot;) agree to the following Terms & Conditions.
            </p>
          </div>

          {/* 1. Eligibility */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                1
              </span>
              Eligibility
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>Users must be 18+ years.</li>
              <li>
                Government-issued ID verification is mandatory for both Hosts &
                Guests.
              </li>
              <li>
                Users must provide true, accurate, and updated information.
              </li>
            </ul>
          </section>

          {/* 2. Booking & Use */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                2
              </span>
              Booking & Use of Property
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>Guests must follow all house rules set by the Host.</li>
              <li>Maximum guest limit must be followed.</li>
              <li>
                Parties, loud music, gatherings, illegal activities, or events
                are strictly prohibited unless explicitly allowed by the Host in
                writing.
              </li>
              <li>
                Guests must respect the property, neighborhood, and local laws.
              </li>
              <li>
                The app is not responsible for police complaints arising due to
                guest behavior.
              </li>
            </ul>
          </section>

          {/* 3. Host Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                3
              </span>
              Host Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                Host must list accurate property details, images, rules,
                pricing, and availability.
              </li>
              <li>
                Host must ensure safety—basic cleanliness, functional locks,
                lighting, and secure premises.
              </li>
              <li>
                Host must follow local regulations for renting or short-term
                stays.
              </li>
            </ul>
          </section>

          {/* 4. Guest Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                4
              </span>
              Guest Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                Guest must maintain hygiene and handle property with care.
              </li>
              <li>
                Guest must not conduct any illegal activity such as drugs,
                gambling, prostitution, or violence.
              </li>
              <li>
                Damage caused by the Guest must be compensated directly to the
                Host.
              </li>
            </ul>
          </section>

          {/* 5. Verification & Security */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                5
              </span>
              Verification & Security
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                All users must undergo ID verification (Aadhaar, Passport,
                Driving License, etc.).
              </li>
              <li>
                The app may conduct random checks to ensure account
                authenticity.
              </li>
              <li>
                The app may report suspicious or illegal behavior to
                authorities.
              </li>
            </ul>
          </section>

          {/* 6. Payments */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                6
              </span>
              Payments
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                All payments must be completed through approved payment methods
                in the app.
              </li>
              <li>
                Cozy NCR is not responsible for failed transactions or delays
                caused by banks, UPI, or gateways.
              </li>
            </ul>
          </section>

          {/* 7. Cancellations & Refunds */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                7
              </span>
              Cancellations & Refunds
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                Cancellation and refund policies are controlled by the Host.
              </li>
              <li>
                The App does not guarantee refunds unless the Host approves.
              </li>
              <li>
                Any dispute regarding refund must be resolved directly between
                Host & Guest.
              </li>
            </ul>
          </section>

          {/* 8. Pricing & Fees */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                8
              </span>
              Pricing & Fees
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>Hosts decide pricing.</li>
              <li>
                Cozy NCR may charge service fees, platform fees, or taxes.
              </li>
              <li>GST will be paid by the App as per applicable laws.</li>
            </ul>
          </section>

          {/* 9. Insurance, Damage & Liability */}
          <section className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              9. Insurance, Damage & Liability
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-red-800 mb-2">
                  9.1 General Liability
                </h3>
                <p className="mb-2">Cozy NCR is not responsible for:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm marker:text-red-300">
                  <li>Property damage</li>
                  <li>Loss of belongings</li>
                  <li>Theft</li>
                  <li>Injuries</li>
                  <li>Accidents</li>
                  <li>Fights between Guests & Hosts</li>
                  <li>
                    Misconduct, negligence, or illegal activity by any user
                  </li>
                  <li>
                    Misrepresentation or fake property details uploaded by Hosts
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-red-800 mb-2">
                  9.2 Drunk, Unsafe, or Irresponsible Behavior
                </h3>
                <p className="mb-2">
                  Cozy NCR is not responsible for incidents caused by:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm marker:text-red-300">
                  <li>Drunk behavior</li>
                  <li>Jumping from balcony/terrace</li>
                  <li>Self-harm</li>
                  <li>Accidental falls</li>
                  <li>Misuse of property</li>
                  <li>Reckless acts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-red-800 mb-2">
                  9.3 Death Insurance Policy
                </h3>
                <p className="mb-2">
                  In case of death caused by an accidental incident, the app
                  will provide:
                </p>
                <p className="font-bold text-lg text-black mb-2">
                  ₹10,000 (Ten Thousand Rupees) as maximum insurance coverage.
                </p>
                <p className="text-sm italic mb-2">
                  This is the only insurance provided by Cozy NCR.
                </p>
                <p className="mb-2">The App will NOT pay anything for:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm marker:text-red-300">
                  <li>Injury</li>
                  <li>Medical treatment</li>
                  <li>Property damage</li>
                  <li>Emotional loss</li>
                  <li>Legal claims</li>
                </ul>
                <p className="mt-2 font-medium">
                  This amount is final and non-negotiable.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Property Damage */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                10
              </span>
              Property Damage
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>Any damage caused by Guest must be settled with the Host.</li>
              <li>Cozy NCR is not part of property damage settlements.</li>
              <li>Cozy NCR will not pay any amount for property repair.</li>
            </ul>
          </section>

          {/* 11. Safety */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                11
              </span>
              Safety & Emergency Protocol
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                Guests must follow emergency instructions provided by the Host.
              </li>
              <li>
                In case of fire, electrical faults, water leaks, or structural
                damage, contact local authorities immediately.
              </li>
              <li>
                The App does not guarantee on-ground emergency assistance.
              </li>
            </ul>
          </section>

          {/* 12. Illegal Activities */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                12
              </span>
              Illegal Activities
            </h2>
            <p className="mb-2 font-medium">
              The following are strictly prohibited:
            </p>
            <ul className="list-disc pl-5 space-y-1 marker:text-gray-400 mb-2">
              <li>Drugs or narcotics</li>
              <li>Prostitution</li>
              <li>Weapon usage</li>
              <li>Gambling</li>
              <li>Violence</li>
              <li>Trespassing</li>
              <li>Property misuse</li>
            </ul>
            <p className="text-red-600 font-medium">
              Cozy NCR may suspend the account and inform authorities.
            </p>
          </section>

          {/* 13. Police & Legal */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                13
              </span>
              Police & Legal Compliance
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
              <li>
                Hosts and Guests must comply with local police registration
                rules (if applicable).
              </li>
              <li>
                Cozy NCR is not responsible for police action due to:
                <ul className="list-circle pl-5 mt-1 text-gray-500">
                  <li>Noise complaints</li>
                  <li>Parties</li>
                  <li>Illegal acts</li>
                  <li>Unregistered stays</li>
                  <li>Overcrowding</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* 14-19. Misc Sections */}
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                14. User Data & Privacy
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Cozy NCR collects necessary data for account creation,
                  verification, and booking.
                </li>
                <li>
                  All data is stored securely and used only for platform
                  operations.
                </li>
                <li>Users may request data deletion as per privacy laws.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                15. Platform Conduct
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>No user may harass, threaten, or abuse another user.</li>
                <li>
                  Fake reviews, misleading listings, scams, or fraud will lead
                  to permanent ban.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                16. Dispute Resolution
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Any dispute between Host & Guest should be resolved directly.
                </li>
                <li>Cozy NCR is not a party to personal disputes.</li>
                <li>
                  All legal disputes with the App will be resolved only through
                  binding arbitration, not through court trials.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                17. App Suspension & Termination
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Cozy NCR may suspend or terminate accounts for violations.
                </li>
                <li>
                  Once suspended, users cannot create new accounts without
                  approval.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                18. No Guarantee of Availability
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Listings, availability, and pricing are controlled by Hosts.
                </li>
                <li>
                  The App does not guarantee uninterrupted or error-free
                  service.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                19. Modification of T&C
              </h2>
              <p className="text-sm">
                Cozy NCR may update these Terms at any time. Continued use of
                the platform means acceptance of updated Terms.
              </p>
            </div>
          </section>

          {/* 20. Acceptance */}
          <section className="bg-gray-900 text-white p-8 rounded-3xl mt-12">
            <h2 className="text-2xl font-bold mb-6">20. Acceptance</h2>
            <p className="mb-4 text-gray-300">
              By using Cozy NCR, you agree that:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                <p>You have read and understood these Terms & Conditions.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                <p>
                  You accept all clauses, responsibilities, and limitations of
                  liability.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
