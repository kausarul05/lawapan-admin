"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call to send reset code (Replace with your actual backend call) ---
    console.log("Attempting to send password reset code to:", { email });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // IMPORTANT CHANGE: Always redirect to OTP verification page, regardless of email existence.
      // This prevents email enumeration. A generic success message is also used.
      setMessage("If an account with that email exists, a password reset code has been sent.");
      toast.success("Password reset request sent! Please check your email. (Simulated)");

      // Redirect to the OTP verification page
      window.location.href = "/Otp-Verification";

    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-8">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Red Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#ffffff] items-center justify-center border-[2px] border-[#036BB4] p-8">
        <div className="text-center">
          {/* Replaced src with a placeholder. Update with your actual image path in the /public folder. */}
          <img
            src="/admin-logo.png"
            alt="TikaFood Logo"
            className="mx-auto mb-4 max-w-full h-auto"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/BA2721/FFFFFF?text=Image+Not+Found";
            }}
          />
        </div>
      </div>

      {/* Right Forgot Password Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                <h2 className="self-stretch text-center text-[#036BB4] text-2xl font-bold font-[Open_Sans]">
                  Forgot Password
                </h2>
                <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                  Enter your email address to get a verification code
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* Email Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="email"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 font-[Open_Sans] w-full">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-green-600 text-sm text-center mt-2 font-[Open_Sans] w-full">
                    {message}
                  </p>
                )}

                {/* Send Code Button */}
                <button
                  type="submit"
                  className={`w-28 h-10 mx-auto mt-4 bg-[#036BB4] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-blue-700 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
