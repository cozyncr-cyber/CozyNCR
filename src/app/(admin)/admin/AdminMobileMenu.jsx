"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function AdminMobileMenu({ navItems }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden w-full fixed top-16 left-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-gray-600">Menu</span>

        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-sm"
            >
              <item.icon className="w-5 h-5 text-gray-400" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
