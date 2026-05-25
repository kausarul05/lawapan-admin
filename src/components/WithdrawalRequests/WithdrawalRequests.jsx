// src/components/WithdrawalRequests.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/solid';
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const itemsPerPage = 10;

  // Fetch withdrawal requests
  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await withdrawalAPI.getAllWithdrawals(currentPage, itemsPerPage, searchTerm);

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

  const openPaymentModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowPaymentModal(true);
  };

  const handleApproveWithPayment = async (withdrawalId, paymentMethod) => {
    try {
      setProcessingPayment(true);
      const response = await withdrawalAPI.updateWithdrawalStatus(withdrawalId, {
        status: 'approved',
        payment_method: paymentMethod
      });

      console.log("Approve response:", response);

      if (response.success) {
        if (paymentMethod === 'card' || paymentMethod === 'direct_pay') {
          // Open payment URL in new tab if available
          if (response.data?.card_payment_url || response.data?.cash_payment_url) {
            const paymentUrl = response.data.card_payment_url || response.data.cash_payment_url;
            window.open(paymentUrl, '_blank');
            toast.success("Payment gateway opened! Complete the payment to finalize.");
          } else {
            toast.success("Withdrawal request approved successfully!");
          }
        } else if (paymentMethod === 'cash') {
          toast.success("Withdrawal request approved as cash payment!");
        }

        setShowPaymentModal(false);
        setSelectedWithdrawal(null);
        await fetchWithdrawals();
      } else {
        toast.error(response.message || "Failed to approve withdrawal");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error(error.message || "Failed to approve withdrawal");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleReject = async (withdrawalId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionInProgress(withdrawalId);
      const response = await withdrawalAPI.updateWithdrawalStatus(withdrawalId, {
        status: 'rejected',
        rejection_reason: rejectReason
      });

      console.log("Reject response:", response);

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
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedWithdrawal(null);
    }
  };

  const openRejectModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowRejectModal(true);
  };

  const handleViewDetails = (withdrawalId) => {
    router.push(`/admin/withdrawal-requests/${withdrawalId}`);
  };

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Fetch withdrawals when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchWithdrawals();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
              onChange={handleSearchChange}
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
              Review and process transporter withdrawal requests. Approve via Card, Direct Pay, or Cash, or reject with a reason.
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
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => {
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
                      {isPending ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openPaymentModal(withdrawal)}
                            disabled={actionInProgress === withdrawal._id}
                            className={`px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${actionInProgress === withdrawal._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Process Payment"
                          >
                            <CreditCardIcon className="w-3 h-3" />
                            Pay Now
                          </button>
                          <button
                            onClick={() => openRejectModal(withdrawal)}
                            disabled={actionInProgress === withdrawal._id}
                            className={`px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${actionInProgress === withdrawal._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Reject"
                          >
                            <XMarkIcon className="w-3 h-3" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleViewDetails(withdrawal._id)}
                            className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewDetails(withdrawal._id)}
                            className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === pageNum
                  ? 'bg-[#036BB4] text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
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
                className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Show total count */}
      {withdrawals.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalWithdrawals)} of {totalWithdrawals} requests
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Process Withdrawal</h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedWithdrawal(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Withdrawal Details</p>
                  <p className="font-medium text-gray-800">{selectedWithdrawal.transporter_id?.company_name || "N/A"}</p>
                  <p className="text-sm text-gray-600">Amount: {formatCurrency(selectedWithdrawal.amount)}</p>
                  <p className="text-sm text-gray-600">Account: {selectedWithdrawal.account_alias || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleApproveWithPayment(selectedWithdrawal._id, 'card')}
                  disabled={processingPayment}
                  className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Pay via Card/Visa/Mastercard</p>
                      <p className="text-xs text-gray-500">Online card payment</p>
                    </div>
                  </div>
                  <span className="text-blue-500">→</span>
                </button>

                <button
                  onClick={() => handleApproveWithPayment(selectedWithdrawal._id, 'direct_pay')}
                  disabled={processingPayment}
                  className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Direct Pay Transfer</p>
                      <p className="text-xs text-gray-500">Direct PayDunya transfer to account</p>
                    </div>
                  </div>
                  <span className="text-purple-500">→</span>
                </button>

                <button
                  onClick={() => handleApproveWithPayment(selectedWithdrawal._id, 'cash')}
                  disabled={processingPayment}
                  className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <BanknotesIcon className="w-5 h-5 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Cash Payment</p>
                      <p className="text-xs text-gray-500">Manual cash handoff</p>
                    </div>
                  </div>
                  <span className="text-green-500">→</span>
                </button>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  For card/direct pay, you'll be redirected to PayDunya to complete the payment. For cash, the withdrawal will be marked as approved without online transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Reject Withdrawal Request</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedWithdrawal(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-500">Transporter</p>
                  <p className="font-medium text-gray-800">{selectedWithdrawal.transporter_id?.company_name || "N/A"}</p>
                  <p className="text-sm text-gray-600 mt-1">Amount: {formatCurrency(selectedWithdrawal.amount)}</p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for rejecting this withdrawal request..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be shared with the transporter
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedWithdrawal(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedWithdrawal._id)}
                disabled={!rejectReason.trim() || actionInProgress === selectedWithdrawal._id}
                className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${(!rejectReason.trim() || actionInProgress === selectedWithdrawal._id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {actionInProgress === selectedWithdrawal._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <XMarkIcon className="w-4 h-4" />
                )}
                Confirm Rejection
              </button>
            </div>
          </div>
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