// components/FAQForm.js
"use client";

import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function FAQForm({ mode = "add", initialData = null, onBack }) {
  
  const isEdit = mode === "edit";

  return (
    <div className="p-8 bg-white min-h-screen font-sans">
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? "Edit FAQ" : "Add FAQ"}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Question Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Question:</label>
            <input 
              type="text" 
              defaultValue={initialData?.question || "How do i change my password?"}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
            />
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Answer:</label>
            <textarea 
              rows={8}
              defaultValue={initialData?.answer || "Navigate to Settings > Account > Security > Change Password..."}
              className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#036BB4] resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button className="w-full bg-[#036BB4] text-white py-4 rounded-full font-bold text-lg hover:bg-[#025a99] transition-all shadow-md">
              {isEdit ? "Save & Change" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}