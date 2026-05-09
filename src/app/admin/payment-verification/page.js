// app/admin/payment-verification/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { paymentAPI } from "@/lib/api";

// Function to get payment method badge color
const getPaymentMethodColor = (method) => {
  switch (method?.toLowerCase()) {
    case 'payduna':
      return 'bg-purple-100 text-purple-800';
    case 'bank':
      return 'bg-blue-100 text-blue-800';
    case 'cash':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch payments
  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getShipperPayments(currentPage, itemsPerPage, searchTerm);

      console.log("API Response:", response);

      if (response.success) {
        setPayments(response.data || []);
        setTotalPayments(response.meta?.total || response.data?.length || 0);
        setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
      } else {
        toast.error(response.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(error.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
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
      day: 'numeric'
    });
  };

  const handleAccept = async (paymentId) => {
    console.log("test", paymentId)
    try {
      setActionInProgress(paymentId);
      const response = await paymentAPI.verifyPayment(paymentId);

      if (response.success) {
        toast.success("Payment accepted and verified successfully!");
        await fetchPayments();
      } else {
        toast.error(response.message || "Failed to accept payment");
      }
    } catch (error) {
      console.error("Error accepting payment:", error);
      toast.error(error.message || "Failed to accept payment");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      setActionInProgress(paymentId);
      const response = await paymentAPI.rejectShipperPayment(paymentId);

      if (response.success) {
        toast.error("Payment rejected. Shipper will be notified.");
        await fetchPayments();
      } else {
        toast.error(response.message || "Failed to reject payment");
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error(error.message || "Failed to reject payment");
    } finally {
      setActionInProgress(null);
    }
  };

  // Debounced search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
              <p className="text-gray-500 text-sm mt-1">
                Verify payments received from shippers
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Total: {totalPayments}
                </span>
              </p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by shipper, transaction or payment method..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-black">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 rounded-l-md">Shipper</th>
                <th className="py-3 px-6">Shipment</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Payment Method</th>
                <th className="py-3 px-6">Transaction ID</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{payment.shipper_name || payment.shipper_id?.company_name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{payment.shipper_email || payment.shipper_id?.email || "N/A"}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{payment.shipment_title || payment.shipment_id?.shipment_title || "N/A"}</p>
                      <p className="text-xs text-gray-500">ID: {payment.shipment_id?._id?.slice(-8).toUpperCase() || "N/A"}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-green-600">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.payment_method)}`}>
                        {payment.payment_method || "N/A"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(payment.payment_date || payment.createdAt)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-gray-600">{payment.transaction_id || "N/A"}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                          payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {payment.status === 'verified' ? 'Verified' : payment.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {payment.status === 'pending' || payment.status === 'bank_pending' || payment.status === 'verified' ? (
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleAccept(payment.payment_id)}
                            disabled={actionInProgress === payment.payment_id}
                            className={`w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Accept Payment"
                          >
                            {actionInProgress === payment.payment_id ? (
                              <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(payment.payment_id)}
                            disabled={actionInProgress === payment.payment_id}
                            className={`w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Reject Payment"
                          >
                            {actionInProgress === payment.payment_id ? (
                              <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <XMarkIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    {searchTerm ? "No payments found matching your search." : "No pending payments found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-6 border-t border-gray-200">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                  className={`w-10 h-10 rounded-md transition-colors ${currentPage === pageNum
                    ? 'bg-[#036BB4] text-white font-bold'
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
                  className="w-10 h-10 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Show total count */}
        {payments.length > 0 && (
          <div className="px-6 pb-4 text-sm text-gray-500 text-right">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPayments)} of {totalPayments} payments
          </div>
        )}
      </div>
    </div>
  );
}