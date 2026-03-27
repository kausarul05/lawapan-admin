"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  // Function to handle OTP verification submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      setLoading(false);
      return;
    }

    // Basic OTP format validation (e.g., 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      toast.error("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call to verify OTP (Replace with your actual backend call) ---
    console.log("Attempting to verify OTP:", { otp });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Simulate success or failure based on OTP (for demonstration)
      if (otp === "123456") { // Example correct OTP
        setMessage("OTP verified successfully! Redirecting to password reset...");
        toast.success("OTP Verified! (Simulated)");
        // In a real application, redirect to the password reset page
        window.location.href = "/set-new-password"; // Redirect to a new password page
      } else {
        setError("Invalid OTP. Please try again.");
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Function to handle resending OTP
  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");
    console.log("Attempting to resend OTP...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      setMessage("A new OTP has been sent to your email.");
      toast.success("New OTP sent! (Simulated)");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Red Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#BA2721] items-center justify-center p-8">
        <div className="text-center">
          {/* Replaced src with a placeholder. Update with your actual image path in the /public folder. */}
          <img
            src="/TikaFood-image.png"
            alt="TikaFood Logo"
            className="mx-auto mb-4 max-w-full h-auto"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/BA2721/FFFFFF?text=Image+Not+Found";
            }}
          />
        </div>
      </div>

      {/* Right OTP Verification Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                <h2 className="self-stretch text-center text-[#BB2821] text-2xl font-bold font-[Open_Sans]">
                  OTP Verification
                </h2>
                <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                  Please enter the 6-digit code sent to your email address.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* OTP Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="otp"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      Verification Code (OTP)
                    </label>
                    <input
                      type="text" // Use text to allow for masked input later if needed, but restrict to numbers
                      id="otp"
                      className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6" // Restrict input to 6 characters
                      inputMode="numeric" // Hint for mobile keyboards
                      pattern="[0-9]*" // Restrict to numbers
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

                {/* Resend Code Link */}
                <div className="self-stretch flex justify-center mt-2">
                  <button
                    type="button" // Important: use type="button" to prevent form submission
                    onClick={handleResendCode}
                    className={`text-[#BB2821] text-xs font-normal font-[Open_Sans] hover:underline ${
                      resendLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </button>
                </div>

                {/* Verify Code Button */}
                <button
                  type="submit"
                  className={`w-28 h-10 mx-auto mt-4 bg-[#BB2821] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-red-700 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
