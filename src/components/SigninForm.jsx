import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API Login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      alert("Signed In Successfully!");
    }
  };
  return (
    <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm">
          Enter your details to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
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

        {/* Password */}
        <div className="space-y-1">
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
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              Forgot Password?
            </button>
          </div>
        </div>

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
              Sign In <ArrowRight size={20} />
            </>
          )}
        </button>

        {/* Footer */}
        <div className="text-center mt-6 pb-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-bold text-black underline hover:text-gray-700"
            >
              Sign Up
            </a>
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

export default SigninForm;
