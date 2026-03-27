// components/TransporterRegistrations.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { transporterAPI } from "@/lib/api";

export default function TransporterRegistrations() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch transporters from API
  useEffect(() => {
    fetchTransporters();
  }, []);

  const fetchTransporters = async () => {
    try {
      setLoading(true);
      const response = await transporterAPI.getAllTransporters();
      
      if (response.success) {
        setTransporters(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        toast.error(response.message || "Failed to fetch transporters");
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.error(error.message || "Failed to load transporter registrations");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-[#FF6B00]';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle approve
  const handleApprove = async (id) => {
    try {
      setActionInProgress(id);
      const response = await transporterAPI.approveTransporter(id);
      
      if (response.success) {
        toast.success("Transporter approved successfully!");
        await fetchTransporters(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to approve transporter");
      }
    } catch (error) {
      console.error("Error approving transporter:", error);
      toast.error(error.message || "Failed to approve transporter");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    try {
      setActionInProgress(id);
      const response = await transporterAPI.rejectTransporter(id);
      
      if (response.success) {
        toast.success("Transporter rejected successfully!");
        await fetchTransporters(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to reject transporter");
      }
    } catch (error) {
      console.error("Error rejecting transporter:", error);
      toast.error(error.message || "Failed to reject transporter");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleView = (id) => {
    router.push(`/admin/transporter-registration/${id}`);
  };

  // Filter transporters based on search term
  const filteredTransporters = transporters.filter(transporter => 
    transporter.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transporter.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransporters = filteredTransporters.slice(indexOfFirstItem, indexOfLastItem);

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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)] min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transporters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)] min-h-[600px] flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-800 font-['Roboto']">
            Transporter Registration ({transporters.length})
          </h2>
          
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or email..."
                className="pl-9 pr-4 py-2 w-72 text-sm text-black rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 font-semibold text-sm first:rounded-l-md">Company Name</th>
                <th className="py-3 px-6 font-semibold text-sm">Email</th>
                <th className="py-3 px-6 font-semibold text-sm">Phone</th>
                <th className="py-3 px-6 font-semibold text-sm">Number of Trucks</th>
                <th className="py-3 px-6 font-semibold text-sm text-center">Applied Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-center last:rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTransporters.length > 0 ? (
                currentTransporters.map((transporter) => (
                  <tr key={transporter._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {transporter.logo ? (
                          <img 
                            src={transporter.logo} 
                            alt={transporter.company_name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/40x40/036BB4/FFFFFF?text=Logo";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="w-4 h-4 bg-[#036BB4] rounded-sm opacity-20" />
                          </div>
                        )}
                        <span className="text-gray-700 text-sm font-medium">
                          {transporter.company_name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {transporter.email || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {transporter.phone || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {transporter.number_of_trucks || transporter.totalVehicles || 0}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm text-center">
                      {formatDate(transporter.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full ${getStatusColor(transporter.status)} text-white text-[11px] font-bold`}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2" />
                        {transporter.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        {transporter.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(transporter._id)}
                              disabled={actionInProgress === transporter._id}
                              className={`w-7 h-7 rounded-full bg-green-50 flex items-center justify-center border border-green-100 hover:bg-green-500 group transition-all ${
                                actionInProgress === transporter._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Approve"
                            >
                              {actionInProgress === transporter._id ? (
                                <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-green-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </button>
                            <button 
                              onClick={() => handleReject(transporter._id)}
                              disabled={actionInProgress === transporter._id}
                              className={`w-7 h-7 rounded-full bg-red-50 flex items-center justify-center border border-red-100 hover:bg-red-500 group transition-all ${
                                actionInProgress === transporter._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Reject"
                            >
                              {actionInProgress === transporter._id ? (
                                <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-red-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              )}
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleView(transporter._id)}
                          className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 hover:bg-purple-500 group transition-all"
                          title="View Details"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-purple-500 group-hover:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No transporter registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {filteredTransporters.length > 0 && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-8">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 rounded-md ${
                  currentPage === pageNum
                    ? 'bg-[#036BB4] text-white font-bold'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-300">.....</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}