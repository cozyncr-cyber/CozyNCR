"use client";

import Link from "next/link";
import React, { useState } from "react";
import { LogOut, Menu, X, Home, User, ArrowRight } from "lucide-react";
import { logout } from "@/actions/auth";
import Image from "next/image";

export default function Navbar({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* FIXED TOP NAVBAR */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full">
          {/* LEFT: Logo & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={"/cozncr_t.png"}
                height={400}
                width={1000}
                alt="Logo"
                className="h-12 w-24 object-contain"
              />
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Authenticated State */}
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center justify-center p-2  transition-all"
                  title="Go to Dashboard"
                >
                  <div className="rounded-fullflex items-center justify-center">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-50 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-200">
                      <User size={16} />
                      <span>Dashboard</span>
                    </button>
                  </div>
                </Link>

                <button
                  onClick={() => logout()}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              /* Guest State */
              <Link
                href="/signin"
                className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                Start Hosting <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-2">
          {user ? (
            <>
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Account
              </div>
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                href="/properties"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                My Listings
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Profile
              </Link>
              <div className="border-t border-gray-100 my-2 pt-2">
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="p-2">
              <Link
                href="/signin"
                className="block w-full text-center px-4 py-3 bg-black text-white rounded-xl font-bold"
              >
                Sign In / Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
