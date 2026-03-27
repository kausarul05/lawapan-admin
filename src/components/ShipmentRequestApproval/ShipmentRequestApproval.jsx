// components/ShipmentRequestApproval.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { shipmentAPI } from "@/lib/api";

export default function ShipmentRequestApproval() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch pending shipments
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentAPI.getPendingShipments();
      
      if (response.success) {
        setShipments(response.data);
      } else {
        toast.error(response.message || "Failed to fetch shipments");
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error(error.message || "Failed to load shipment requests");
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
      month: 'short',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle approve shipment
  const handleApprove = async (id) => {
    try {
      setActionInProgress(id);
      const response = await shipmentAPI.approveShipment(id);
      
      if (response.success) {
        toast.success("Shipment approved and moved to bidding!");
        await fetchShipments(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to approve shipment");
      }
    } catch (error) {
      console.error("Error approving shipment:", error);
      toast.error(error.message || "Failed to approve shipment");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle reject shipment
  const handleReject = async (id) => {
    try {
      setActionInProgress(id);
      const response = await shipmentAPI.rejectShipment(id);
      
      if (response.success) {
        toast.success("Shipment rejected successfully!");
        await fetchShipments(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to reject shipment");
      }
    } catch (error) {
      console.error("Error rejecting shipment:", error);
      toast.error(error.message || "Failed to reject shipment");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle view details
  const handleViewDetails = (id) => {
    router.push(`/admin/shipment-requests/${id}`);
  };

  // Search filtering logic
  const filteredShipments = shipments.filter((shipment) =>
    shipment.shipment_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

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
      <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex items-center justify-center shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between shadow-sm border border-gray-100">
      <div>
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Shipment Request Approval ({shipments.length})
          </h2>
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, category or address..."
                className="pl-9 pr-4 py-2 w-72 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 text-sm font-semibold first:rounded-l-md">Shipment Title</th>
                <th className="py-3 px-6 text-sm font-semibold">Category</th>
                <th className="py-3 px-6 text-sm font-semibold">Weight</th>
                <th className="py-3 px-6 text-sm font-semibold">Price</th>
                <th className="py-3 px-6 text-sm font-semibold">Pickup Address</th>
                <th className="py-3 px-6 text-sm font-semibold text-center">Date Preference</th>
                <th className="py-3 px-6 text-sm font-semibold text-center last:rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentShipments.length > 0 ? (
                currentShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {shipment.shipment_title || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                        {shipment.category || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {shipment.weight || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-green-600">
                      {formatPrice(shipment.price)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                      {shipment.pickup_address || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">
                      {formatDate(shipment.date_preference)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        {/* Accept Button */}
                        <button 
                          onClick={() => handleApprove(shipment._id)}
                          disabled={actionInProgress === shipment._id}
                          className={`w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 group hover:bg-green-500 transition-all shadow-sm ${
                            actionInProgress === shipment._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Approve Shipment"
                        >
                          {actionInProgress === shipment._id ? (
                            <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-green-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                        
                        {/* Reject Button */}
                        <button 
                          onClick={() => handleReject(shipment._id)}
                          disabled={actionInProgress === shipment._id}
                          className={`w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group hover:bg-red-500 transition-all shadow-sm ${
                            actionInProgress === shipment._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Reject Shipment"
                        >
                          {actionInProgress === shipment._id ? (
                            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-red-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                        </button>
                        
                        {/* View Details Button */}
                        <button 
                          onClick={() => handleViewDetails(shipment._id)}
                          className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 group hover:bg-purple-500 transition-all shadow-sm"
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
                  <td colSpan="7" className="py-10 text-center text-gray-400 italic">
                    {searchTerm ? "No shipment requests found matching your search." : "No pending shipment requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {filteredShipments.length > 0 && totalPages > 1 && (
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
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-300 font-bold">.....</span>
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
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Show total count */}
      {filteredShipments.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredShipments.length)} of {filteredShipments.length} entries
        </div>
      )}
    </div>
  );
}