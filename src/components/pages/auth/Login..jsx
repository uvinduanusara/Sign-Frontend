import React, { useState } from "react";
import { Camera, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Card } from "../../ui/card";
import { toast } from "sonner";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5001/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      // Save token + user data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          email: data.email,
          role: data.role,
          roleName: data.roleName,
        })
      );

      toast.success("Login successful!");

      // Redirect based on role
      if (data.roleName === "admin" || data.roleName === "instructor") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Right Panel - Login Form */}
      <div className="w-full flex items-center justify-center p-8">
        <Card>
          <div className="w-full max-w-md p-5">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  SignDetect AI
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">
                Access your AI-powered communication platform
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gray-800 bg-gray-100 border-gray-300 rounded focus:ring-gray-800 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-gray-800 hover:text-gray-600 font-semibold transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && (
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-gray-800 hover:text-gray-600 font-semibold transition-colors duration-200"
                >
                  Sign up for free
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
