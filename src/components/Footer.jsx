import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-stone-50 text-gray-600 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src={"/cozncr_t.png"}
                height={400}
                width={1000}
                alt="CozyNCR Logo"
                className="h-12 w-24 object-contain"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The premier hosting platform for Delhi-NCR.
            </p>
          </div>

          {/* Simplified Links Area */}
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-10 md:gap-24 md:justify-end">
            {/* Account & Legal */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Account
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link
                    href="/signin"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Create new account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Terms & Condition
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Connect
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a
                    href="mailto:cozyncr@gmail.com"
                    className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/cozyncr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  >
                    <Instagram size={16} />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
