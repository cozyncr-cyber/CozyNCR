import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
// Import the server actions we created
import { signinWithAppwrite, sendPasswordRecovery } from "@/actions/auth";
import { redirect, useRouter } from "next/navigation";

const SigninForm = () => {
  const router = useRouter();

  // View state: 'signin' or 'forgot_password'
  const [view, setView] = useState("signin");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    // Clear global errors when typing
    if (errors.general) setErrors({ ...errors, general: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";

    // Only validate password if we are in signin view
    if (view === "signin" && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (view === "signin") {
        // --- Handle Login ---
        const result = await signinWithAppwrite(formData);

        if (result.error) {
          setErrors({ general: result.error });
        } else {
          // Ideally, redirect here
          router.refresh();
          router.push("/"); // Update auth state
        }
      } else {
        // --- Handle Forgot Password ---
        const result = await sendPasswordRecovery(formData.email);

        if (result.error) {
          setErrors({ general: result.error });
        } else {
          setRecoverySent(true);
        }
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === "signin" ? "forgot_password" : "signin");
    setErrors({});
    setRecoverySent(false);
  };

  return (
    <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {view === "signin" ? "Welcome Back" : "Reset Password"}
        </h1>
        <p className="text-gray-500 text-sm">
          {view === "signin"
            ? "Enter your details to access your account"
            : "Enter your email to receive a recovery link"}
        </p>
      </div>

      {/* Success State for Recovery */}
      {view === "forgot_password" && recoverySent ? (
        <div className="px-8 pb-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Check your email</h3>
          <p className="text-gray-500 text-sm">
            We&apos;ve sent a password recovery link to <br />
            <span className="font-medium text-gray-900">{formData.email}</span>
          </p>
          <button
            onClick={toggleView}
            className="w-full mt-4 text-black font-bold hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        /* Main Form */
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {/* Global Error Message */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email ID</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-10"
              />
            </div>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </div>

          {/* Password - Only show in Signin view */}
          {view === "signin" && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}

              {/* Forgot Password Link Trigger */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={toggleView}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3.5 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {view === "signin" ? "Sign In" : "Send Recovery Link"}{" "}
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Footer / Back Button */}
          <div className="text-center mt-6 pb-2">
            {view === "signin" ? (
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-bold text-black underline hover:text-gray-700"
                >
                  Sign Up
                </a>
              </p>
            ) : (
              <button
                type="button"
                onClick={toggleView}
                className="text-sm text-gray-500 hover:text-black flex items-center justify-center gap-1 w-full"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </div>
        </form>
      )}
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

export default SigninForm;
