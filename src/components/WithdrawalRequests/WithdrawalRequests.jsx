// src/components/WithdrawalRequests.jsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { withdrawalAPI } from '@/lib/api';

const WithdrawalRequests = () => {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch withdrawal requests
  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await withdrawalAPI.getAllWithdrawals(currentPage, itemsPerPage);

      console.log("API Response:", response);

      if (response.success) {
        setWithdrawals(response.data || []);
        setTotalWithdrawals(response.meta?.total || response.data?.length || 0);
        setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
      } else {
        toast.error(response.message || "Failed to fetch withdrawal requests");
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error(error.message || "Failed to load withdrawal requests");
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
      day: 'numeric'
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

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Pending', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' };
      case 'approved':
        return { text: 'Approved', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
      default:
        return { text: status || 'Unknown', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const handleApprove = async (withdrawalId) => {
    try {
      setActionInProgress(withdrawalId);
      const response = await withdrawalAPI.approveWithdrawal(withdrawalId);

      if (response.success) {
        toast.success("Withdrawal request approved successfully!");
        await fetchWithdrawals();
      } else {
        toast.error(response.message || "Failed to approve withdrawal");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error(error.message || "Failed to approve withdrawal");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (withdrawalId) => {
    try {
      setActionInProgress(withdrawalId);
      const response = await withdrawalAPI.rejectWithdrawal(withdrawalId);

      if (response.success) {
        toast.success("Withdrawal request rejected successfully!");
        await fetchWithdrawals();
      } else {
        toast.error(response.message || "Failed to reject withdrawal");
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast.error(error.message || "Failed to reject withdrawal");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleViewDetails = (withdrawalId) => {
    router.push(`/admin/withdrawal-requests/${withdrawalId}`);
  };

  // Filter withdrawals based on search term
  const filteredWithdrawals = withdrawals.filter(withdrawal =>
    withdrawal.transporter_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.account_holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.account_alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(indexOfFirstItem, indexOfLastItem);
  const currentTotalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading withdrawal requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm font-sans min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Withdrawal Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage transporter withdrawal requests
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Total: {totalWithdrawals}
            </span>
          </p>
        </div>

        <div className="flex items-center w-full md:w-auto">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, holder or account..."
              className="pl-9 pr-4 py-2 w-full text-black md:w-80 text-sm rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#036BB4]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">Withdrawal Policy</p>
            <p className="text-xs text-blue-700 mt-1">
              Review and process transporter withdrawal requests. Approve or reject based on eligibility and available funds.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#036BB4] text-white">
              <th className="py-3.5 px-4 text-sm font-semibold first:rounded-tl-lg">Transporter</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Amount</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Region</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Account Details</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Date Submitted</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Status</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center last:rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentWithdrawals.length > 0 ? (
              currentWithdrawals.map((withdrawal) => {
                const statusBadge = getStatusBadge(withdrawal.status);
                const isPending = withdrawal.status === 'pending';

                return (
                  <tr key={withdrawal._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {withdrawal.transporter_id?.company_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {withdrawal.transporter_id?._id?.slice(-8).toUpperCase() || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(withdrawal.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">
                      {withdrawal.region || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {withdrawal.account_holder_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {withdrawal.account_alias || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500">
                      {formatDate(withdrawal.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                        <span className={`w-1.5 h-1.5 ${statusBadge.dot} rounded-full mr-1.5`}></span>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApprove(withdrawal._id)}
                              disabled={actionInProgress === withdrawal._id}
                              className={`w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm ${actionInProgress === withdrawal._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              title="Approve"
                            >
                              {actionInProgress === withdrawal._id ? (
                                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CheckIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(withdrawal._id)}
                              disabled={actionInProgress === withdrawal._id}
                              className={`w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm ${actionInProgress === withdrawal._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              title="Reject"
                            >
                              {actionInProgress === withdrawal._id ? (
                                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <XMarkIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewDetails(withdrawal._id)}
                          className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400 text-sm">
                  {searchTerm ? "No withdrawal requests found matching your search." : "No withdrawal requests found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {currentTotalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
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
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === pageNum
                    ? 'bg-[#036BB4] text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {currentTotalPages > 5 && currentPage < currentTotalPages - 2 && (
            <>
              <span className="px-2 text-gray-400">...</span>
              <button
                onClick={() => goToPage(currentTotalPages)}
                className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm"
              >
                {currentTotalPages}
              </button>
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === currentTotalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === currentTotalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Show total count */}
      {filteredWithdrawals.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWithdrawals.length)} of {filteredWithdrawals.length} requests
        </div>
      )}
    </div>
  );
};

// Import Chevron icons for pagination
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default WithdrawalRequests;