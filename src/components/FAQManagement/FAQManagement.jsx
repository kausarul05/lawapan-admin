// components/FAQManagement/FAQManagement.js
"use client";

import React, { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { faqAPI } from "@/lib/api";

export default function FAQManagement({ onAddClick, onEditClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFAQs, setTotalFAQs] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch FAQs from API
  useEffect(() => {
    fetchFAQs();
  }, [currentPage]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await faqAPI.getAllFAQs(currentPage, itemsPerPage);
      
      if (response.success) {
        setFaqs(response.data);
        setTotalFAQs(response.data.length);
        // Calculate total pages based on response data length
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        toast.error(response.message || "Failed to fetch FAQs");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error(error.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete FAQ
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }
    
    try {
      setActionInProgress(id);
      const response = await faqAPI.deleteFAQ(id);
      
      if (response.success) {
        toast.success("FAQ deleted successfully!");
        await fetchFAQs(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error(error.message || "Failed to delete FAQ");
    } finally {
      setActionInProgress(null);
    }
  };

  // Search filtering logic
  const filteredFAQs = faqs.filter((faq) =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFAQs = filteredFAQs.slice(indexOfFirstItem, indexOfLastItem);
  const filteredTotalPages = Math.ceil(filteredFAQs.length / itemsPerPage);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < filteredTotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Truncate text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            FAQ Management ({totalFAQs})
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Add FAQ Button */}
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#036BB4] text-white rounded-full text-sm hover:bg-[#025a99] transition-all shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Add FAQ
            </button>

            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by question or answer..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* FAQ Cards Grid */}
        {currentFAQs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFAQs.map((faq) => (
              <div key={faq._id} className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all relative group bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-800 pr-12 text-sm line-clamp-2">
                    {faq.question}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditClick(faq)} 
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit FAQ"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq._id)}
                      disabled={actionInProgress === faq._id}
                      className={`text-red-400 hover:text-red-600 transition-colors ${
                        actionInProgress === faq._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete FAQ"
                    >
                      {actionInProgress === faq._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {truncateText(faq.answer, 120)}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Updated: {new Date(faq.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchTerm ? "No FAQs found matching your search." : "No FAQs added yet. Click 'Add FAQ' to create one."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredFAQs.length > 0 && filteredTotalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-8 pb-4">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          {Array.from({ length: Math.min(5, filteredTotalPages) }, (_, i) => {
            let pageNum;
            if (filteredTotalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= filteredTotalPages - 2) {
              pageNum = filteredTotalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 rounded-md transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#0169B2] text-white font-bold shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {filteredTotalPages > 5 && currentPage < filteredTotalPages - 2 && (
            <>
              <span className="px-2 text-gray-300 font-bold">.....</span>
              <button
                onClick={() => goToPage(filteredTotalPages)}
                className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100"
              >
                {filteredTotalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === filteredTotalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors ${
              currentPage === filteredTotalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Show total count */}
      {filteredFAQs.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFAQs.length)} of {filteredFAQs.length} FAQs
        </div>
      )}
    </div>
  );
}