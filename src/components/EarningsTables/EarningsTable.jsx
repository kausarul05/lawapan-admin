// components/EarningsTable.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { earningAPI } from "@/lib/api";

const itemsPerPage = 10;

export default function EarningsTable() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("weekly");
  const [open, setOpen] = useState(false);
  const filterOptions = ["weekly", "monthly", "yearly"];
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch earnings data
  useEffect(() => {
    fetchEarnings();
  }, [selectedFilter, currentPage]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await earningAPI.getEarnings(selectedFilter, currentPage, itemsPerPage);

      console.log("API Response:", response);

      if (response.success) {
        setEarnings(response.data || []);
        setTotalEarnings(response.meta?.total || response.data?.length || 0);
        setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
        setTotalAmount(response.total_amount || response.meta?.totalAmount || 0);
      } else {
        toast.error(response.message || "Failed to fetch earnings");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error(error.message || "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getFilterDisplayName = (filter) => {
    switch (filter) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return filter;
    }
  };

  // Filter earnings based on search term
  const filteredEarnings = earnings.filter(earning =>
    earning.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
    earning.shipment_title?.toLowerCase().includes(search.toLowerCase()) ||
    earning.transporter_name?.toLowerCase().includes(search.toLowerCase()) ||
    earning.shipper_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const viewTransactionDetails = (transactionId) => {
    router.push(`/admin/earning/${transactionId}`);
  };

  // Get current page data for display (client-side pagination after search)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEarnings = filteredEarnings.slice(indexOfFirstItem, indexOfLastItem);
  const currentTotalPages = Math.ceil(filteredEarnings.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{ boxShadow: "0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)" }}
        className="bg-white text-black p-6 rounded-lg shadow-lg min-h-[400px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ boxShadow: "0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)" }}
        className="bg-white text-black p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold">Earnings Overview</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total {getFilterDisplayName(selectedFilter)} Revenue: {formatCurrency(totalAmount)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* search input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction, shipment or name..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Weekly/Monthly/Yearly Revenue and Dropdown */}
        <div className="relative text-black flex flex-col justify-center items-center mb-6">
          <div className="mb-2 text-sm">
            {getFilterDisplayName(selectedFilter)} Revenue{" "}
            <span className="font-bold text-lg text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#036BB4] border border-gray-300 text-white text-sm hover:bg-[#025a99] transition-colors"
          >
            <span>{getFilterDisplayName(selectedFilter)}</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${open ? "rotate-180" : ""
                }`}
            />
          </button>

          <div
            className={`absolute top-full mt-1 w-[100px] rounded-lg bg-white border border-gray-200 text-xs shadow-lg z-10 transform transition-all duration-300 origin-top overflow-hidden ${open
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0 pointer-events-none"
              }`}
          >
            {filterOptions.map((option) => (
              <div
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => {
                  setSelectedFilter(option);
                  setOpen(false);
                  setCurrentPage(1);
                }}
              >
                {getFilterDisplayName(option)}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-black">
            <thead>
              <tr className="bg-[#036BB4] text-white text-center rounded-lg">
                <th className="py-3 px-4 rounded-tl-lg">Transaction ID</th>
                <th className="py-3 px-4">Shipment</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEarnings.length > 0 ? (
                currentEarnings.map((earning, idx) => (
                  <tr
                    key={earning._id || idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition text-center"
                  >
                    <td className="py-3 px-4 font-mono text-xs">
                      {earning.transaction_id || earning._id?.slice(-12).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{earning.shipment_title || "N/A"}</p>
                      <p className="text-xs text-gray-400">ID: {earning.shipment_id?._id?.slice(-8).toUpperCase() || "N/A"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{earning.shipper_name || earning.transporter_name || "N/A"}</p>
                        <p className="text-xs text-gray-500">{earning.customer_type || "Customer"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-700">{formatCurrency(earning.amount)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-orange-600">{formatCurrency(earning.commission || earning.commission_amount || 0)}</span>
                      {earning.commission_percentage && (
                        <p className="text-xs text-gray-400">({earning.commission_percentage}%)</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-green-600">{formatCurrency(earning.net_amount || earning.final_amount || earning.amount)}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {formatDate(earning.createdAt || earning.date)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewTransactionDetails(earning._id || earning.transaction_id)}
                        className="p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors"
                        title="View Details"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    {search ? "No earnings found matching your search." : "No earnings data available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {currentTotalPages > 1 && (
        <div className="flex justify-end items-center mt-6 gap-2 text-sm text-black">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center border border-[#036BB4] rounded-full justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1"
                stroke="#036BB4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {Array.from({ length: Math.min(5, currentTotalPages) }, (_, i) => {
            let pageNum;
            if (currentTotalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= currentTotalPages - 2) {
              pageNum = currentTotalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentPage === pageNum
                    ? "bg-[#036BB4] text-white"
                    : "hover:bg-gray-100 text-gray-600"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {currentTotalPages > 5 && currentPage < currentTotalPages - 2 && (
            <>
              <span className="px-2 text-gray-400">.....</span>
              <button
                onClick={() => handlePageChange(currentTotalPages)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
              >
                {currentTotalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === currentTotalPages}
            className="w-8 h-8 flex items-center border border-[#036BB4] rounded-full justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13"
                stroke="#036BB4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Show total count */}
      {filteredEarnings.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEarnings.length)} of {filteredEarnings.length} transactions
        </div>
      )}
    </>
  );
}