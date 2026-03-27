"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SetNewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Function to handle password reset submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!newPassword || !confirmPassword) {
      setError("Please enter both new and confirm passwords.");
      toast.error("Please enter both new and confirm passwords.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      toast.error("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    // Basic password strength validation (e.g., minimum 8 characters)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call to set new password (Replace with your actual backend call) ---
    console.log("Attempting to set new password...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Simulate success
      setMessage("Your password has been reset successfully!");
      toast.success("Password Reset Successful! (Simulated)");

      // Redirect to login page after successful password reset
      window.location.href = "/"; // Assuming your login page is at /login

    } catch (err) {
      console.error("Set new password error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
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

      {/* Right Set New Password Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                <h2 className="self-stretch text-center text-[#BB2821] text-2xl font-bold font-[Open_Sans]">
                  Set a New Password
                </h2>
                <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                  Create a new password. Ensure it differs from previous ones of security
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* New Password Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="new-password"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      New Password
                    </label>
                    <div className="relative self-stretch">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans] pr-10"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showNewPassword ? (
                          // Eye-slash icon (hidden password) - using a simple SVG for demonstration
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.981 12H12m0 0l-3.981 3.981M12 12l-3.981-3.981M12 12v7.981"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.004 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                            />
                          </svg>
                        ) : (
                          // Eye icon (visible password)
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Confirm New Password Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="confirm-password"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative self-stretch">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans] pr-10"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showConfirmPassword ? (
                          // Eye-slash icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.981 12H12m0 0l-3.981 3.981M12 12l-3.981-3.981M12 12v7.981"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.004 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                            />
                          </svg>
                        ) : (
                          // Eye icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
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

                {/* Update Password Button */}
                <button
                  type="submit"
                  className={`w-36 h-10 mx-auto mt-4 bg-[#BB2821] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-red-700 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
