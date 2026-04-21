// app/admin/payment-verification/page.js
"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const fakePayments = [
  {
    _id: "pay_001",
    shipper_name: "John Smith",
    shipper_email: "john.smith@example.com",
    shipment_title: "Electronics Shipment",
    amount: 2500.00,
    payment_date: "2024-01-28T10:30:00Z",
    payment_method: "PayDuna",
    transaction_id: "TRX-PD-123456",
    status: "pending_verification"
  },
  {
    _id: "pay_002",
    shipper_name: "Sarah Johnson",
    shipper_email: "sarah.j@example.com",
    shipment_title: "Furniture Transport",
    amount: 3750.50,
    payment_date: "2024-01-29T14:20:00Z",
    payment_method: "Bank",
    transaction_id: "TRX-BK-789012",
    status: "pending_verification"
  },
  {
    _id: "pay_003",
    shipper_name: "Michael Brown",
    shipper_email: "michael.b@example.com",
    shipment_title: "Medical Supplies",
    amount: 5200.00,
    payment_date: "2024-01-30T09:15:00Z",
    payment_method: "Cash",
    transaction_id: "TRX-CS-345678",
    status: "pending_verification"
  },
  {
    _id: "pay_004",
    shipper_name: "Emily Davis",
    shipper_email: "emily.d@example.com",
    shipment_title: "Construction Equipment",
    amount: 8900.00,
    payment_date: "2024-01-31T16:45:00Z",
    payment_method: "PayDuna",
    transaction_id: "TRX-PD-901234",
    status: "pending_verification"
  },
  {
    _id: "pay_005",
    shipper_name: "David Wilson",
    shipper_email: "david.w@example.com",
    shipment_title: "Automotive Parts",
    amount: 3100.75,
    payment_date: "2024-02-01T11:30:00Z",
    payment_method: "Bank",
    transaction_id: "TRX-BK-567890",
    status: "pending_verification"
  }
];

// Function to get payment method badge color
const getPaymentMethodColor = (method) => {
  switch (method) {
    case 'PayDuna':
      return 'bg-purple-100 text-purple-800';
    case 'Bank':
      return 'bg-blue-100 text-blue-800';
    case 'Cash':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PaymentVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleAccept = async (paymentId) => {
    setActionInProgress(paymentId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Payment accepted and verified successfully!");
    setActionInProgress(null);
    setShowModal(false);
  };

  const handleReject = async (paymentId) => {
    setActionInProgress(paymentId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.error("Payment rejected. Shipper will be notified.");
    setActionInProgress(null);
    setShowModal(false);
  };

  const filteredPayments = fakePayments.filter(p =>
    p.shipper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
              <p className="text-gray-500 text-sm mt-1">Verify payments received from shippers</p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by shipper, transaction or payment method..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="py-3 px-6 text-center rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800">{payment.shipper_name}</p>
                    <p className="text-xs text-gray-500">{payment.shipper_email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">{payment.shipment_title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-green-600">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.payment_method)}`}>
                      {payment.payment_method}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(payment.payment_date)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-600">{payment.transaction_id}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleAccept(payment._id)}
                        disabled={actionInProgress === payment._id}
                        className={`w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Accept Payment"
                      >
                        {actionInProgress === payment._id ? (
                          <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(payment._id)}
                        disabled={actionInProgress === payment._id}
                        className={`w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Reject Payment"
                      >
                        {actionInProgress === payment._id ? (
                          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XMarkIcon className="w-4 h-4" />
                        )}
                      </button>
                      {/* <button
                        onClick={() => setSelectedPayment(payment)}
                        className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button> */}
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
        {filteredPayments.length > 0 && (
          <div className="px-6 pb-4 text-sm text-gray-500 text-right">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Shipper</p>
                  <p className="font-medium text-gray-800">{selectedPayment.shipper_name}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.shipper_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Shipment</p>
                <p className="font-medium text-gray-800">{selectedPayment.shipment_title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-600">{selectedPayment.transaction_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(selectedPayment.payment_method)}`}>
                    {selectedPayment.payment_method}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedPayment.payment_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleAccept(selectedPayment._id)}
                disabled={actionInProgress === selectedPayment._id}
                className={`flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${actionInProgress === selectedPayment._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {actionInProgress === selectedPayment._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                Accept Payment
              </button>
              <button
                onClick={() => handleReject(selectedPayment._id)}
                disabled={actionInProgress === selectedPayment._id}
                className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${actionInProgress === selectedPayment._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {actionInProgress === selectedPayment._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <XMarkIcon className="w-4 h-4" />
                )}
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}