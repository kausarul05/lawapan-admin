// app/admin/transporter-payment-requests/page.js
"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const fakeTransporterPayments = [
  {
    _id: "tp_001",
    transporter_name: "FastTrack Logistics",
    transporter_email: "dispatch@fasttrack.com",
    shipment_title: "Electronics Delivery",
    amount: 2000.00,
    request_date: "2024-01-30T10:30:00Z",
    status: "pending",
    bank_details: "Bank of America - ****1234",
    account_holder: "FastTrack Logistics",
    routing_number: "******7890"
  },
  {
    _id: "tp_002",
    transporter_name: "Highway Haulers",
    transporter_email: "contact@highwayhaulers.com",
    shipment_title: "Furniture Transport",
    amount: 3000.00,
    request_date: "2024-01-31T14:20:00Z",
    status: "pending",
    bank_details: "Chase Bank - ****5678",
    account_holder: "Highway Haulers Inc.",
    routing_number: "******3456"
  },
  {
    _id: "tp_003",
    transporter_name: "Express Cargo Services",
    transporter_email: "operations@expresscargo.com",
    shipment_title: "Medical Supplies",
    amount: 4500.00,
    request_date: "2024-02-01T09:15:00Z",
    status: "pending",
    bank_details: "Wells Fargo - ****9012",
    account_holder: "Express Cargo Services LLC",
    routing_number: "******1234"
  },
  {
    _id: "tp_004",
    transporter_name: "Reliable Transport Co",
    transporter_email: "info@reliable.com",
    shipment_title: "Construction Equipment",
    amount: 7800.00,
    request_date: "2024-02-02T16:45:00Z",
    status: "pending",
    bank_details: "Bank of America - ****3456",
    account_holder: "Reliable Transport Co",
    routing_number: "******5678"
  },
  {
    _id: "tp_005",
    transporter_name: "Swift Delivery Solutions",
    transporter_email: "dispatch@swift.com",
    shipment_title: "Retail Goods",
    amount: 1800.00,
    request_date: "2024-02-03T11:30:00Z",
    status: "pending",
    bank_details: "Chase Bank - ****7890",
    account_holder: "Swift Delivery Solutions",
    routing_number: "******9012"
  }
];

export default function TransporterPaymentRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const itemsPerPage = 10;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleMarkAsPaid = async (requestId) => {
    setActionInProgress(requestId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Payment marked as paid and sent to transporter!");
    setActionInProgress(null);
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setActionInProgress(requestId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.error(`Payment request rejected. Reason: ${rejectReason}`);
    setActionInProgress(null);
    setShowRejectModal(false);
    setRejectReason("");
    setRejectRequestId(null);
  };

  const openRejectModal = (requestId, request) => {
    setSelectedRequest(request);
    setRejectRequestId(requestId);
    setShowRejectModal(true);
  };

  const filteredRequests = fakeTransporterPayments.filter(r =>
    r.transporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.shipment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bank_details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Transporter Payment Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Review and process payment requests from transporters</p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transporter, shipment or bank..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="py-3 px-6">Request Date</th>
                <th className="py-3 px-6">Bank Details</th>
                <th className="py-3 px-6 text-center rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-black">
              {currentRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800">{req.transporter_name}</p>
                    <p className="text-xs text-gray-500">{req.transporter_email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">{req.shipment_title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-green-600">{formatCurrency(req.amount)}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {formatDate(req.request_date)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">{req.bank_details}</p>
                    <p className="text-xs text-gray-500">{req.account_holder}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleMarkAsPaid(req._id)}
                        disabled={actionInProgress === req._id}
                        className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${actionInProgress === req._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Mark as Paid"
                      >
                        {actionInProgress === req._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CreditCardIcon className="w-4 h-4" />
                        )}
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => openRejectModal(req._id, req)}
                        disabled={actionInProgress === req._id}
                        className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${actionInProgress === req._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Reject Payment"
                      >
                        {actionInProgress === req._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XMarkIcon className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
        {filteredRequests.length > 0 && (
          <div className="px-6 pb-4 text-sm text-gray-500 text-right">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  <p className="font-medium text-gray-800">{selectedRequest.transporter_name}</p>
                  <p className="text-sm text-gray-600 mt-1">Amount: {formatCurrency(selectedRequest.amount)}</p>
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