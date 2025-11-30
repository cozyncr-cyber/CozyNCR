import Link from "next/link";
import { Home, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src={"/cozncr_t.png"}
                height={400}
                width={1000}
                alt="Logo"
                className="h-12 w-24 object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier hosting platform for Delhi-NCR. We connect exceptional
              properties with discerning guests, ensuring safety, transparency,
              and growth for every host.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/signin"
                  className="hover:text-amber-500 transition-colors"
                >
                  Host Login
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Safety Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-amber-500 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CozyNCR Hospitality Pvt Ltd. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
