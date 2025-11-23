"use client"; // Required for useState

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex justify-between items-center px-6 py-4 md:px-20 bg-white z-50">
      {/* --- LOGO --- */}
      <div className="flex shrink-0">
        <Image
          src={"/cozncr_t.png"}
          height={400}
          width={1000}
          alt="Logo"
          className="h-12 w-24 object-contain"
        />
      </div>

      {/* --- DESKTOP NAVIGATION (Hidden on mobile, Flex on md) --- */}
      <div className="hidden md:flex gap-6">
        <button className="outline-none border-b-2 border-transparent hover:border-black transition-colors">
          My Listings
        </button>
        <button className="outline-none border-b-2 border-transparent hover:border-black transition-colors">
          Calendar
        </button>
        <button className="outline-none border-b-2 border-transparent hover:border-black transition-colors">
          Another Functionality
        </button>
      </div>

      {/* --- RIGHT SIDE (Auth + Mobile Toggle) --- */}
      <div className="flex items-center gap-4">
        {/* Auth Button (Always visible) */}
        <button className="bg-black py-2 px-6 rounded-xl shadow-md text-slate-200 hover:shadow-lg hover:bg-slate-950 transition-all">
          <Link href={"/signin"}>Sign In</Link>
        </button>

        {/* Hamburger Icon (Visible on mobile only) */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 focus:outline-none"
        >
          {isMenuOpen ? (
            // Close Icon (X)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* --- MOBILE DRAWER --- */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "80px" }}
      >
        <div className="flex flex-col gap-8 text-xl font-medium">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="outline-none hover:text-gray-600"
          >
            My Listings
          </button>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="outline-none hover:text-gray-600"
          >
            Calendar
          </button>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="outline-none hover:text-gray-600"
          >
            Another Functionality
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
