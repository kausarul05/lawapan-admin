// components/RegistrationTable.js
"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { transporterAPI } from "@/lib/api";

export default function RegistrationTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format membership ID (using first 8 chars of _id)
  const formatMembershipId = (id) => {
    if (!id) return "N/A";
    return id.slice(-8).toUpperCase();
  };

  // Handle view details
  const handleViewDetails = (id) => {
    router.push(`/admin/transporter-registration/${id}`);
  };

  // Handle approve
  const handleApprove = async (id) => {
    try {
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
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    try {
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
    }
  };

  // Filter transporters based on search term
  const filteredTransporters = transporters.filter(transporter => 
    transporter.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transporter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatMembershipId(transporter._id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransporters = filteredTransporters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransporters.length / itemsPerPage);

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

  // Handle search change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transporters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-lg font-bold text-black font-['Roboto']">
          Transporter Registrations ({transporters.length})
        </h2>

        <div className="flex items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              className="pl-9 pr-4 py-1.5 w-64 text-sm text-black rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#036BB4] text-white">
              <th className="py-3 px-4 font-semibold text-sm first:rounded-l-md">Membership ID</th>
              <th className="py-3 px-4 font-semibold text-sm">Company Name</th>
              <th className="py-3 px-4 font-semibold text-sm">Email</th>
              <th className="py-3 px-4 font-semibold text-sm">Phone</th>
              <th className="py-3 px-4 font-semibold text-sm text-center">Registration Date</th>
              <th className="py-3 px-4 font-semibold text-sm text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-sm text-center last:rounded-r-md">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTransporters.length > 0 ? (
              currentTransporters.map((transporter) => (
                <tr key={transporter._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600 text-sm font-mono">
                    {formatMembershipId(transporter._id)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                        {transporter.logo ? (
                          <img 
                            src={transporter.logo} 
                            alt={transporter.company_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/icon/truck-logo.png";
                            }}
                          />
                        ) : (
                          <Image src="/icon/truck-logo.png" alt="logo" width={20} height={20} className="opacity-70" />
                        )}
                      </div>
                      <span className="text-gray-800 font-medium text-sm">
                        {transporter.company_name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {transporter.email || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {transporter.phone || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm text-center">
                    {formatDate(transporter.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      transporter.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : transporter.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transporter.status || 'pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* Approve Button - Only show for pending */}
                      {transporter.status === 'pending' && (
                        <button 
                          onClick={() => handleApprove(transporter._id)} 
                          className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors group"
                          title="Approve"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      )}
                      
                      {/* Reject Button - Only show for pending */}
                      {transporter.status === 'pending' && (
                        <button 
                          onClick={() => handleReject(transporter._id)} 
                          className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors group"
                          title="Reject"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      )}
                      
                      {/* View Details Button - Show for all */}
                      <button 
                        onClick={() => handleViewDetails(transporter._id)} 
                        className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center hover:bg-purple-100 transition-colors group"
                        title="View Details"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  {searchTerm ? "No transporters found matching your search" : "No transporter registrations found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {filteredTransporters.length > 0 && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-6">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          {/* Page numbers */}
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
                className={`w-8 h-8 rounded-md text-sm transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#036BB4] text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-400">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="w-8 h-8 rounded-md text-sm text-gray-600 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Show total count */}
      {filteredTransporters.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransporters.length)} of {filteredTransporters.length} entries
        </div>
      )}
    </div>
  );
}