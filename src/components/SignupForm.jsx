import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithAppwrite } from "@/actions/auth";

const SignupForm = () => {
  const router = useRouter();

  // Form State
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

  // UI/Logic State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP Specific State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // --- Helper: Age Validation (18+) ---
  const isAtLeast18 = (dobString) => {
    if (!dobString) return false;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  // --- Helper: Strong Password Regex ---
  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  // Simulate Sending OTP
  const handleSendOtp = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email first." });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setOtpSent(true);
    alert(`OTP sent to ${formData.email}. (Use code 1234)`);
  };

  // Simulate Verifying OTP
  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (formData.otp === "1234") {
      setOtpVerified(true);
      setErrors({ ...errors, otp: "" });
    } else {
      setErrors({ ...errors, otp: 'Invalid OTP. Try "1234"' });
    }
    setIsVerifyingOtp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Basic Validation
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.location) newErrors.location = "Location is required";

    // 2. Age Validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!isAtLeast18(formData.dob)) {
      newErrors.dob = "You must be at least 18 years old to sign up.";
    }

    // 3. Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password =
        "Password must have 8+ chars, 1 upper, 1 lower, 1 number, & 1 symbol";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreedToTerms) {
      newErrors.terms = "You must agree to the terms";
    }
    if (!otpVerified) {
      newErrors.otp = "Please verify your email first";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      // Call Server Action
      const result = await signupWithAppwrite(formData);

      setIsLoading(false);

      if (result.success) {
        alert("Account created successfully!");
        // Force refresh ensures the server can read the new cookie
        router.refresh();
        router.push("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          backend: result.error,
        }));
      }
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
        <p className="text-gray-500 text-sm">
          Just a few quick things to get started
        </p>
      </div>

      {/* Backend Error Alert */}
      {errors.backend && (
        <div className="mx-8 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{errors.backend}</p>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
        {/* Name Input */}
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              className="pl-10"
            />
          </div>
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </div>

        {/* Email & OTP Section */}
        <div className="space-y-1">
          <Label htmlFor="email">Email ID</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={otpVerified} // Lock email after verification
                className={`pl-10 ${
                  otpVerified
                    ? "bg-green-50 border-green-200 text-green-700"
                    : ""
                }`}
              />
              {otpVerified && (
                <CheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
              )}
            </div>

            {!otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || otpSent}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 transition-colors whitespace-nowrap"
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

          {/* OTP Input (Shows only after sending) */}
          {otpSent && !otpVerified && (
            <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
              <Input
                name="otp"
                placeholder="Enter OTP (1234)"
                value={formData.otp}
                onChange={handleChange}
                className="text-center tracking-widest font-mono"
                maxLength={4}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
              >
                {isVerifyingOtp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          )}

          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          {errors.otp && <ErrorMessage>{errors.otp}</ErrorMessage>}
        </div>

        {/* Phone & Location Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234..."
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="pl-10 text-gray-500"
            />
          </div>
          {errors.dob && <ErrorMessage>{errors.dob}</ErrorMessage>}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={formData.password}
              onChange={handleChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 accent-purple-600"
            />
          </div>
          <label
            htmlFor="terms"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            I Agree With The{" "}
            <span className="text-purple-600 font-bold cursor-pointer">
              Terms And Conditions
            </span>
          </label>
        </div>
        {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3.5 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Sign Up <ArrowRight size={20} />
        </button>

        {/* Footer */}
        <div className="text-center mt-6 pb-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-black underline hover:text-gray-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-bold text-gray-900 mb-1"
  >
    {children}
  </label>
);

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100"
    } ${className}`}
    {...props}
  />
);

const ErrorMessage = ({ children }) => (
  <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{children}</p>
);

export default SignupForm;
