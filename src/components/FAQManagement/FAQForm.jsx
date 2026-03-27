// components/FAQManagement/FAQForm.js
"use client";

import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { faqAPI } from "@/lib/api";

export default function FAQForm({ mode = "add", initialData = null, onBack, onSuccess }) {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [loading, setLoading] = useState(false);
  
  const isEdit = mode === "edit";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    
    try {
      setLoading(true);
      
      let response;
      if (isEdit) {
        // Update existing FAQ
        response = await faqAPI.updateFAQ(initialData._id, {
          question: question.trim(),
          answer: answer.trim()
        });
      } else {
        // Create new FAQ
        response = await faqAPI.createFAQ({
          question: question.trim(),
          answer: answer.trim()
        });
      }
      
      if (response.success) {
        toast.success(isEdit ? "FAQ updated successfully!" : "FAQ added successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      } else {
        toast.error(response.message || `Failed to ${isEdit ? "update" : "add"} FAQ`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "adding"} FAQ:`, error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "add"} FAQ`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen font-sans">
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          disabled={loading}
          className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? "Edit FAQ" : "Add New FAQ"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black transition-all"
              disabled={loading}
            />
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent resize-none transition-all"
              disabled={loading}
            />
          </div>

          {/* Character count */}
          <div className="text-right text-xs text-gray-400">
            Answer: {answer.length} characters
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-[#036BB4] text-white py-4 rounded-full font-bold text-lg hover:bg-[#025a99] transition-all shadow-md flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add FAQ")}
            </button>
          </div>
          
          {/* Info text */}
          <div className="text-center text-xs text-gray-400">
            {isEdit ? "Edit the FAQ details and click 'Save Changes'" : "Fill in the question and answer to add a new FAQ"}
          </div>
        </div>
      </form>
    </div>
  );
}