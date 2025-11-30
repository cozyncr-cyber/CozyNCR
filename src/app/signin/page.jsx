import SigninForm from "@/components/SigninForm";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function SigninPage() {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative z-10">
        <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto">
          <SigninForm />
        </div>

        <div className="mt-auto pt-8">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CozyNCR Hospitality. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Right: Hero Image Section */}
      <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image
          src="/homeimage2.jpg"
          alt="Luxury Stay"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <blockquote className="max-w-lg">
            <p className="text-3xl font-serif font-medium text-white mb-6 leading-tight">
              &apos;Hosting on CozyNCR has completely transformed how I manage
              my property. It&apos;s effortless and premium.&apos;
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
              <div>
                <div className="text-white font-bold text-sm tracking-wide uppercase">
                  Ayesha Malik
                </div>
                <div className="text-white/60 text-xs font-medium">
                  Superhost • South Delhi
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
