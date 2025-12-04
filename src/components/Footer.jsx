import Link from "next/link";
import { Home, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";

// Helper component to handle the "Updating soon" logic cleanly
const FooterLink = ({ href, children, isActive = false }) => {
  if (isActive) {
    return (
      <Link
        href={href}
        className="hover:text-amber-600 transition-colors font-medium text-gray-600"
      >
        {children}
      </Link>
    );
  }

  // Disabled state with Tooltip
  return (
    <div className="group relative w-max cursor-not-allowed">
      <span className="text-gray-400 transition-colors group-hover:text-gray-500">
        {children}
      </span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Updating soon
        {/* Little arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    // Changed bg-gray-900 to bg-stone-50 (warm white) so the black logo pops
    <footer className="bg-stone-50 text-gray-600 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src={"/cozncr_t.png"}
                height={400}
                width={1000}
                alt="CozyNCR Logo"
                // Logo will now be visible against the light background
                className="h-12 w-24 object-contain"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The premier hosting platform for Delhi-NCR. We connect exceptional
              properties with discerning guests, ensuring safety, transparency,
              and growth for every host.
            </p>
          </div>

          {/* Links Column 1: Platform */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <FooterLink href="/signin" isActive={true}>
                  Host Login
                </FooterLink>
              </li>
              <li>
                <FooterLink href="#">How it Works</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Safety Standards</FooterLink>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <FooterLink href="#">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Careers</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Press</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                {/* Assuming active */}
                <FooterLink href="/terms" isActive={true}>
                  Terms of Service
                </FooterLink>
              </li>
              <li>
                {/* Assuming active */}
                <FooterLink href="/privacy" isActive={true}>
                  Privacy Policy
                </FooterLink>
              </li>
              <li>
                <FooterLink href="#">Cookie Policy</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CozyNCR Hospitality Pvt Ltd. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-amber-600 transition-colors"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-amber-600 transition-colors"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-amber-600 transition-colors"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-amber-600 transition-colors"
            >
              <Facebook size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
