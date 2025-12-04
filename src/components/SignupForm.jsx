"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithAppwrite } from "@/actions/auth";

const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    phone: "",
    location: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // --- Logic Helpers ---
  const isAtLeast18 = (dobString) => {
    if (!dobString) return false;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  const handleSendOtp = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: "Enter a valid email first." });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API
    setIsLoading(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (formData.otp === "1234") {
      setOtpVerified(true);
      setErrors({ ...errors, otp: "" });
    } else {
      setErrors({ ...errors, otp: 'Invalid OTP. Use "1234"' });
    }
    setIsVerifyingOtp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (!formData.dob) newErrors.dob = "Required";
    else if (!isAtLeast18(formData.dob))
      newErrors.dob = "Must be 18+ years old.";

    if (!formData.password) newErrors.password = "Required";
    else if (!isStrongPassword(formData.password))
      newErrors.password = "Must be at least 8 chars";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords match error";
    if (!formData.agreedToTerms) newErrors.terms = "You must agree to terms";
    if (!otpVerified) newErrors.otp = "Email verification required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const result = await signupWithAppwrite(formData);
      setIsLoading(false);

      if (result.success) {
        router.refresh();
        router.push("/dashboard");
      } else {
        setErrors((prev) => ({ ...prev, backend: result.error }));
      }
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
          Join as a Host
        </h1>
        <p className="text-gray-500">
          Create your account to start listing properties.
        </p>
      </div>

      {/* Backend Error Alert */}
      {errors.backend && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          {errors.backend}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-medium text-gray-900"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs ml-1">{errors.name}</p>
          )}
        </div>

        {/* Email & OTP */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={otpVerified}
                placeholder="host@example.com"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none transition-all font-medium ${
                  otpVerified
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
              {otpVerified && (
                // FIXED ALIGNMENT
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
              )}
            </div>
            {!otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || otpSent}
                className="px-5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : otpSent ? (
                  "Resend"
                ) : (
                  "Verify"
                )}
              </button>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs ml-1">{errors.email}</p>
          )}

          {/* Verify OTP Input */}
          {otpSent && !otpVerified && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 pt-2">
              <input
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength={4}
                placeholder="1234"
                className="w-full text-center tracking-widest font-mono text-lg py-2 bg-white border-2 border-black rounded-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="px-6 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          )}
          {errors.otp && (
            <p className="text-red-500 text-xs ml-1">{errors.otp}</p>
          )}
        </div>

        {/* Phone & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs ml-1">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs ml-1">{errors.location}</p>
            )}
          </div>
        </div>

        {/* DOB */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium text-gray-500"
            />
          </div>
          {errors.dob && (
            <p className="text-red-500 text-xs ml-1">{errors.dob}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                // Added pr-10 so text doesn't go under icon
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // FIXED ALIGNMENT
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] ml-1 leading-tight">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">
              Confirm
            </label>
            <div className="relative group">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                // Added pr-10 so text doesn't go under icon
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              />
              {/* Added missing toggle button for Confirm Password */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-black text-black"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <span className="text-black font-bold underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-black font-bold underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-xs ml-1">{errors.terms}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold text-black underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
