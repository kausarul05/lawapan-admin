// components/FAQManagement.js
"use client";

import React, { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

export default function FAQManagement({ onAddClick, onEditClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Example state for FAQs
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do i change my password?",
      answer: "Navigate to Settings > Account > Security > Change Password. Enter your current password, then your new password twice to confirm. Tap 'Save Changes' to update your credentials."
    }
  ]);

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">FAQ Management</h2>
          
          <div className="flex items-center gap-4">
            {/* Add FAQ Button */}
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-600 text-sm hover:bg-gray-50 transition-all"
            >
              <PlusIcon className="h-5 w-5 text-[#036BB4]" />
              Add FAQ
            </button>

            {/* Search Bar */}
            <div className="flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 w-64 text-sm rounded-l-md border border-gray-200 focus:outline-none text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <button className="bg-[#036BB4] p-2 rounded-r-md border border-[#036BB4]">
                 <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
              </button> */}
            </div>
          </div>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 border border-gray-100 rounded-xl max-w-sm shadow-sm relative group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 pr-12">{faq.question}</h3>
                <div className="flex gap-2">
                  <button onClick={() => onEditClick(faq)} className="text-gray-400 hover:text-blue-500">
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-end items-center gap-2 mt-8 pb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-md bg-[#0169B2] text-white font-bold">1</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">2</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">3</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">4</button>
        <span className="px-2 text-gray-300 font-bold">.....</span>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">30</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}