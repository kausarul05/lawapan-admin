// app/admin/transporter-payment-requests/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { paymentAPI } from "@/lib/api";

export default function TransporterPaymentRequests() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequestId, setPaymentRequestId] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const itemsPerPage = 10;

  // Fetch transporter payment requests
  useEffect(() => {
    fetchPaymentRequests();
  }, [currentPage]);

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getTransporterPaymentRequests(currentPage, itemsPerPage);

      console.log("API Response:", response);

      if (response.success) {
        setPayments(response.data || []);
        setTotalPayments(response.meta?.total || response.data?.length || 0);
        setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
      } else {
        toast.error(response.message || "Failed to fetch payment requests");
      }
    } catch (error) {
      console.error("Error fetching payment requests:", error);
      toast.error(error.message || "Failed to load payment requests");
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (requestId, request) => {
    setSelectedRequest(request);
    setPaymentRequestId(requestId);
    setShowPaymentModal(true);
  };

  console.log("yyyyyyyyyyyy", payments)

  const handlePaymentConfirm = async (url) => {
    if (!selectedRequest || !url) {
      toast.error("Invalid payment request");
      return;
    }

    try {
      setProcessingPayment(true);

      console.log("Processing payment...");

      // 👉 Open payment link (handle popup block)
      const paymentWindow = window.open(url, "_blank");

      if (!paymentWindow) {
        throw new Error("Popup blocked! Please allow popups.");
      }

      toast.success("Redirecting to payment gateway...");

      // 👉 UI cleanup (no unnecessary delay)
      setShowPaymentModal(false);
      setSelectedRequest(null);
      setPaymentRequestId(null);

      // 👉 Optional: refresh after slight delay
      setTimeout(() => {
        fetchPaymentRequests();
      }, 1000);

    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionInProgress(requestId);
      const response = await paymentAPI.rejectTransporterPayment(requestId, rejectReason);

      if (response.success) {
        toast.success(`Payment request rejected.`);
        await fetchPaymentRequests();
      } else {
        toast.error(response.message || "Failed to reject payment request");
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error(error.message || "Failed to reject payment request");
    } finally {
      setActionInProgress(null);
      setShowRejectModal(false);
      setRejectReason("");
      setRejectRequestId(null);
      setSelectedRequest(null);
    }
  };

  const openRejectModal = (requestId, request) => {
    setSelectedRequest(request);
    setRejectRequestId(requestId);
    setShowRejectModal(true);
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

  // Get payment method icon and details
  const getPaymentMethodDetails = (method, request) => {
    switch (method?.toLowerCase()) {
      case 'online':
        return {
          icon: <DevicePhoneMobileIcon className="w-5 h-5 text-purple-500" />,
          title: 'Online Payment',
          color: 'bg-purple-100 text-purple-800',
          fields: [
            { label: 'Mobile Money Number', value: request?.mobile_money_phone || 'N/A' },
            { label: 'Amount', value: formatCurrency(request?.amount) },
            { label: 'Note', value: request?.notes || 'No notes provided' }
          ]
        };
      case 'bank':
        return {
          icon: <BuildingLibraryIcon className="w-5 h-5 text-blue-500" />,
          title: 'Bank Transfer',
          color: 'bg-blue-100 text-blue-800',
          fields: [
            { label: 'Bank Name', value: request?.bank_name || 'N/A' },
            { label: 'Account Number', value: request?.account_number || 'N/A' },
            { label: 'Account Holder', value: request?.account_holder || 'N/A' },
            { label: 'Routing Number', value: request?.routing_number || 'N/A' },
            { label: 'Amount', value: formatCurrency(request?.amount) }
          ]
        };
      case 'cash':
        return {
          icon: <BanknotesIcon className="w-5 h-5 text-green-500" />,
          title: 'Cash Payment',
          color: 'bg-green-100 text-green-800',
          fields: [
            { label: 'Amount', value: formatCurrency(request?.amount) },
            { label: 'Note', value: request?.notes || 'Cash payment requested' }
          ]
        };
      default:
        return {
          icon: <CreditCardIcon className="w-5 h-5 text-gray-500" />,
          title: 'Payment',
          color: 'bg-gray-100 text-gray-800',
          fields: [
            { label: 'Amount', value: formatCurrency(request?.amount) }
          ]
        };
    }
  };

  // Get status badge configuration
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
      case 'approved':
      case 'paid':
        return { text: 'Paid', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' };
      default:
        return { text: status || 'Pending', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };
    }
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.transporter_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transporter_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.shipment_id?.shipment_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
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
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const currentTotalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Transporter Payment Requests</h1>
              <p className="text-gray-500 text-sm mt-1">
                Review and process payment requests from transporters
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Total: {totalPayments}
                </span>
              </p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transporter, shipment, email or method..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 rounded-l-md">Transporter</th>
                <th className="py-3 px-6">Shipment</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Payment Method</th>
                <th className="py-3 px-6">Request Date</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-black">
              {currentPayments.length > 0 ? (
                currentPayments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  const isPending = payment.status === 'pending';
                  const methodDetails = getPaymentMethodDetails(payment.payment_method, payment);

                  return (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-800">
                          {payment.transporter_id?.company_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Email: {payment.transporter_email || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {payment.transporter_id?._id?.slice(-8).toUpperCase() || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-gray-700">
                          {payment.shipment_id?.shipment_title || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {payment.shipment_id?._id?.slice(-8).toUpperCase() || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-green-600">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {methodDetails.icon}
                          <span className={`text-sm px-2 py-1 rounded-full ${methodDetails.color}`}>
                            {payment.payment_method || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                          <span className={`w-1.5 h-1.5 ${statusBadge.dot} rounded-full mr-1.5`}></span>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isPending ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openPaymentModal(payment._id, payment)}
                              disabled={actionInProgress === payment._id}
                              className={`px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              title="Process Payment"
                            >
                              {actionInProgress === payment._id ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CreditCardIcon className="w-3 h-3" />
                              )}
                              Pay Now
                            </button>
                            <button
                              onClick={() => openRejectModal(payment._id, payment)}
                              disabled={actionInProgress === payment._id}
                              className={`px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              title="Reject Payment"
                            >
                              <XMarkIcon className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    {searchTerm ? "No payment requests found matching your search." : "No pending payment requests from transporters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {currentTotalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-6 border-t border-gray-200">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                  className={`w-10 h-10 rounded-md transition-colors ${currentPage === pageNum
                    ? 'bg-[#036BB4] text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
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
                  className="w-10 h-10 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  {currentTotalPages}
                </button>
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === currentTotalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === currentTotalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Show total count */}
        {filteredPayments.length > 0 && (
          <div className="px-6 pb-4 text-sm text-gray-500 text-right">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} requests
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                {getPaymentMethodDetails(selectedRequest.payment_method, selectedRequest).icon}
                <h2 className="text-xl font-bold text-gray-800">
                  {getPaymentMethodDetails(selectedRequest.payment_method, selectedRequest).title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                  setPaymentRequestId(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Transporter Information</p>
                  <p className="font-medium text-gray-800">{selectedRequest.transporter_id?.company_name || "N/A"}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.transporter_email || "N/A"}</p>
                </div>

                <div className="space-y-3">
                  {getPaymentMethodDetails(selectedRequest.payment_method, selectedRequest).fields.map((field, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-2">
                      <p className="text-xs text-gray-500">{field.label}</p>
                      <p className="text-sm font-medium text-gray-800">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Please verify the payment details before proceeding. Once confirmed, you will be redirected to the payment gateway.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                  setPaymentRequestId(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePaymentConfirm(selectedRequest.paydunya_url)}
                disabled={processingPayment}
                className={`flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {processingPayment ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CreditCardIcon className="w-4 h-4" />
                )}
                {processingPayment ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Reject Payment Request</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setRejectRequestId(null);
                  setSelectedRequest(null);
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
                  <p className="font-medium text-gray-800">{selectedRequest.transporter_id?.company_name || "N/A"}</p>
                  <p className="text-sm text-gray-600 mt-1">Amount: {formatCurrency(selectedRequest.amount)}</p>
                  <p className="text-sm text-gray-600">Shipment: {selectedRequest.shipment_id?.shipment_title || "N/A"}</p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for rejecting this payment request..."
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
                  setRejectRequestId(null);
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectRequestId)}
                disabled={!rejectReason.trim() || actionInProgress === rejectRequestId}
                className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${(!rejectReason.trim() || actionInProgress === rejectRequestId) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {actionInProgress === rejectRequestId ? (
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
}