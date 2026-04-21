// app/admin/pending-payment-requests/page.js
"use client";

import React, { useState, useEffect } from "react";
// import {
//     MagnifyingGlassIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon,
//     CheckIcon,
//     XMarkIcon,
//     EyeIcon
// } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { paymentAPI } from "@/lib/api";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "lucide-react";

// Fake/Demo data for testing with updated payment methods
const fakePayments = [
    {
        _id: "pay_001",
        payment_id: "PAY-2024-001",
        shipper_name: "John Smith",
        shipper_email: "john.smith@example.com",
        shipper_phone: "+1 (555) 123-4567",
        shipment_title: "Electronics Shipment - New York to Boston",
        shipment_id: "SHIP-001",
        shipment_from: "New York, NY",
        shipment_to: "Boston, MA",
        amount: 2500.00,
        payment_method: "Bank Payment",
        description: "Payment for electronics shipment delivery",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
    },
    {
        _id: "pay_002",
        payment_id: "PAY-2024-002",
        shipper_name: "Sarah Johnson",
        shipper_email: "sarah.j@example.com",
        shipper_phone: "+1 (555) 234-5678",
        shipment_title: "Furniture Transport - Chicago to Detroit",
        shipment_id: "SHIP-002",
        shipment_from: "Chicago, IL",
        shipment_to: "Detroit, MI",
        amount: 3750.50,
        payment_method: "Cash Payment",
        description: "Office furniture moving service",
        createdAt: "2024-01-16T14:20:00Z",
        updatedAt: "2024-01-16T14:20:00Z"
    },
    {
        _id: "pay_003",
        payment_id: "PAY-2024-003",
        shipper_name: "Michael Brown",
        shipper_email: "michael.b@example.com",
        shipper_phone: "+1 (555) 345-6789",
        shipment_title: "Food Products - California to Texas",
        shipment_id: "SHIP-003",
        shipment_from: "Los Angeles, CA",
        shipment_to: "Houston, TX",
        amount: 1850.00,
        payment_method: "Digital Payment",
        description: "Perishable goods transportation",
        createdAt: "2024-01-17T09:15:00Z",
        updatedAt: "2024-01-17T09:15:00Z"
    },
    {
        _id: "pay_004",
        payment_id: "PAY-2024-004",
        shipper_name: "Emily Davis",
        shipper_email: "emily.d@example.com",
        shipper_phone: "+1 (555) 456-7890",
        shipment_title: "Medical Supplies - Florida to Georgia",
        shipment_id: "SHIP-004",
        shipment_from: "Miami, FL",
        shipment_to: "Atlanta, GA",
        amount: 5200.00,
        payment_method: "Bank Payment",
        description: "Urgent medical equipment delivery",
        createdAt: "2024-01-18T11:45:00Z",
        updatedAt: "2024-01-18T11:45:00Z"
    },
    {
        _id: "pay_005",
        payment_id: "PAY-2024-005",
        shipper_name: "David Wilson",
        shipper_email: "david.w@example.com",
        shipper_phone: "+1 (555) 567-8901",
        shipment_title: "Automotive Parts - Michigan to Ohio",
        shipment_id: "SHIP-005",
        shipment_from: "Detroit, MI",
        shipment_to: "Cleveland, OH",
        amount: 3100.75,
        payment_method: "Cash Payment",
        description: "Auto parts shipment for manufacturing",
        createdAt: "2024-01-19T08:00:00Z",
        updatedAt: "2024-01-19T08:00:00Z"
    },
    {
        _id: "pay_006",
        payment_id: "PAY-2024-006",
        shipper_name: "Lisa Anderson",
        shipper_email: "lisa.a@example.com",
        shipper_phone: "+1 (555) 678-9012",
        shipment_title: "Textile Products - North Carolina to Virginia",
        shipment_id: "SHIP-006",
        shipment_from: "Charlotte, NC",
        shipment_to: "Richmond, VA",
        amount: 2250.00,
        payment_method: "Digital Payment",
        description: "Fabric and textile materials",
        createdAt: "2024-01-20T13:30:00Z",
        updatedAt: "2024-01-20T13:30:00Z"
    },
    {
        _id: "pay_007",
        payment_id: "PAY-2024-007",
        shipper_name: "Robert Taylor",
        shipper_email: "robert.t@example.com",
        shipper_phone: "+1 (555) 789-0123",
        shipment_title: "Construction Equipment - Texas to Oklahoma",
        shipment_id: "SHIP-007",
        shipment_from: "Dallas, TX",
        shipment_to: "Oklahoma City, OK",
        amount: 8900.00,
        payment_method: "Bank Payment",
        description: "Heavy machinery transport",
        createdAt: "2024-01-21T15:20:00Z",
        updatedAt: "2024-01-21T15:20:00Z"
    },
    {
        _id: "pay_008",
        payment_id: "PAY-2024-008",
        shipper_name: "Jennifer Martinez",
        shipper_email: "jennifer.m@example.com",
        shipper_phone: "+1 (555) 890-1234",
        shipment_title: "Pharmaceuticals - New Jersey to Pennsylvania",
        shipment_id: "SHIP-008",
        shipment_from: "Newark, NJ",
        shipment_to: "Philadelphia, PA",
        amount: 6700.00,
        payment_method: "Cash Payment",
        description: "Temperature-sensitive medication delivery",
        createdAt: "2024-01-22T10:10:00Z",
        updatedAt: "2024-01-22T10:10:00Z"
    },
    {
        _id: "pay_009",
        payment_id: "PAY-2024-009",
        shipper_name: "William Garcia",
        shipper_email: "william.g@example.com",
        shipper_phone: "+1 (555) 901-2345",
        shipment_title: "Retail Goods - Washington to Oregon",
        shipment_id: "SHIP-009",
        shipment_from: "Seattle, WA",
        shipment_to: "Portland, OR",
        amount: 1950.00,
        payment_method: "Digital Payment",
        description: "Clothing and accessories shipment",
        createdAt: "2024-01-23T12:45:00Z",
        updatedAt: "2024-01-23T12:45:00Z"
    },
    {
        _id: "pay_010",
        payment_id: "PAY-2024-010",
        shipper_name: "Maria Rodriguez",
        shipper_email: "maria.r@example.com",
        shipper_phone: "+1 (555) 012-3456",
        shipment_title: "Electronics Components - California to Arizona",
        shipment_id: "SHIP-010",
        shipment_from: "San Francisco, CA",
        shipment_to: "Phoenix, AZ",
        amount: 4450.00,
        payment_method: "Bank Payment",
        description: "Circuit boards and electronic parts",
        createdAt: "2024-01-24T16:30:00Z",
        updatedAt: "2024-01-24T16:30:00Z"
    },
    {
        _id: "pay_011",
        payment_id: "PAY-2024-011",
        shipper_name: "James Wilson",
        shipper_email: "james.w@example.com",
        shipper_phone: "+1 (555) 123-7890",
        shipment_title: "Beverage Products - Colorado to Kansas",
        shipment_id: "SHIP-011",
        shipment_from: "Denver, CO",
        shipment_to: "Wichita, KS",
        amount: 2850.00,
        payment_method: "Cash Payment",
        description: "Soft drinks and beverages distribution",
        createdAt: "2024-01-25T09:00:00Z",
        updatedAt: "2024-01-25T09:00:00Z"
    },
    {
        _id: "pay_012",
        payment_id: "PAY-2024-012",
        shipper_name: "Patricia Brown",
        shipper_email: "patricia.b@example.com",
        shipper_phone: "+1 (555) 234-8901",
        shipment_title: "Paper Products - Wisconsin to Minnesota",
        shipment_id: "SHIP-012",
        shipment_from: "Milwaukee, WI",
        shipment_to: "Minneapolis, MN",
        amount: 1650.00,
        payment_method: "Digital Payment",
        description: "Office paper and stationery supplies",
        createdAt: "2024-01-26T11:15:00Z",
        updatedAt: "2024-01-26T11:15:00Z"
    }
];

// Function to get payment method badge color
const getPaymentMethodColor = (method) => {
    switch(method) {
        case 'Bank Payment':
            return 'bg-blue-100 text-blue-800';
        case 'Cash Payment':
            return 'bg-green-100 text-green-800';
        case 'Digital Payment':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function PendingPaymentRequests() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);
    const [actionInProgress, setActionInProgress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [useFakeData, setUseFakeData] = useState(false);
    const itemsPerPage = 10;

    // Fetch pending payments
    useEffect(() => {
        fetchPayments();
    }, [currentPage]);

    const fetchPayments = async () => {
        setLoading(true);

        try {
            // Try to fetch from API first
            try {
                const response = await paymentAPI.getPendingPayments(currentPage, itemsPerPage);

                if (response.success && response.data && (response.data.length > 0 || (response.data.payments && response.data.payments.length > 0))) {
                    const paymentData = response.data.payments || response.data;
                    setPayments(paymentData);
                    setTotalPayments(response.data.total || paymentData.length);
                    setTotalPages(response.data.totalPages || Math.ceil((response.data.total || paymentData.length) / itemsPerPage));
                    setUseFakeData(false);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log("API not available, using fake data");
            }

            // Use fake data if API fails or returns empty
            console.log("Loading fake data...", fakePayments.length);
            setUseFakeData(true);
            setPayments(fakePayments);
            setTotalPayments(fakePayments.length);
            setTotalPages(Math.ceil(fakePayments.length / itemsPerPage));

        } catch (error) {
            console.error("Error fetching payments:", error);
            // Use fake data on error
            setUseFakeData(true);
            setPayments(fakePayments);
            setTotalPayments(fakePayments.length);
            setTotalPages(Math.ceil(fakePayments.length / itemsPerPage));
            toast.error("Using demo data. API connection failed.");
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "N/A";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Handle approve payment
    const handleApprove = async (paymentId) => {
        try {
            setActionInProgress(paymentId);

            if (useFakeData) {
                // Simulate API call for fake data
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success("Payment approved successfully! (Demo)");
                // Remove the approved payment from the list
                setPayments(prev => prev.filter(p => p._id !== paymentId));
                setTotalPayments(prev => prev - 1);
                setTotalPages(Math.ceil((totalPayments - 1) / itemsPerPage));
                setShowModal(false);
            } else {
                const response = await paymentAPI.approvePayment(paymentId);

                if (response.success) {
                    toast.success("Payment approved successfully!");
                    await fetchPayments();
                    setShowModal(false);
                } else {
                    toast.error(response.message || "Failed to approve payment");
                }
            }
        } catch (error) {
            console.error("Error approving payment:", error);
            toast.error(error.message || "Failed to approve payment");
        } finally {
            setActionInProgress(null);
        }
    };

    // Handle reject payment
    const handleReject = async (paymentId) => {
        try {
            setActionInProgress(paymentId);

            if (useFakeData) {
                // Simulate API call for fake data
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success("Payment rejected successfully! (Demo)");
                // Remove the rejected payment from the list
                setPayments(prev => prev.filter(p => p._id !== paymentId));
                setTotalPayments(prev => prev - 1);
                setTotalPages(Math.ceil((totalPayments - 1) / itemsPerPage));
                setShowModal(false);
            } else {
                const response = await paymentAPI.rejectPayment(paymentId);

                if (response.success) {
                    toast.success("Payment rejected successfully!");
                    await fetchPayments();
                    setShowModal(false);
                } else {
                    toast.error(response.message || "Failed to reject payment");
                }
            }
        } catch (error) {
            console.error("Error rejecting payment:", error);
            toast.error(error.message || "Failed to reject payment");
        } finally {
            setActionInProgress(null);
        }
    };

    // View payment details
    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setShowModal(true);
    };

    // Filter payments based on search term
    const filteredPayments = payments.filter((payment) =>
        payment.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.shipper_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.shipment_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.shipment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                {/* Header Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Pending Payment Requests</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Review and approve shipper payment requests
                                {useFakeData && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                                        Demo Mode
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by shipper, shipment or payment ID..."
                                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Total Pending</p>
                        <p className="text-2xl font-bold text-blue-700">{filteredPayments.length}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-yellow-600 font-medium">Total Amount Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">
                            {formatCurrency(filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0))}
                        </p>
                    </div>
                    {/* <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">This Month</p>
                        <p className="text-2xl font-bold text-green-700">
                            {filteredPayments.filter(p => {
                                const date = new Date(p.createdAt);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </div> */}
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#036BB4] text-white">
                                <th className="py-3 px-6 text-sm font-semibold rounded-l-md">Payment ID</th>
                                <th className="py-3 px-6 text-sm font-semibold">Shipper</th>
                                <th className="py-3 px-6 text-sm font-semibold">Shipment</th>
                                <th className="py-3 px-6 text-sm font-semibold">Amount</th>
                                <th className="py-3 px-6 text-sm font-semibold">Payment Method</th>
                                <th className="py-3 px-6 text-sm font-semibold">Date</th>
                                <th className="py-3 px-6 text-sm font-semibold text-center">Status</th>
                                <th className="py-3 px-6 text-sm font-semibold text-center rounded-r-md">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentPayments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-mono text-gray-600">
                                        {payment.payment_id || payment._id?.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {payment.shipper_name || "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {payment.shipper_email || "N/A"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm text-gray-700">{payment.shipment_title || "N/A"}</p>
                                        <p className="text-xs text-gray-500">{payment.shipment_id}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-green-600">
                                            {formatCurrency(payment.amount)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.payment_method)}`}>
                                            {payment.payment_method || "N/A"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {formatDate(payment.createdAt)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                                            Pending
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleApprove(payment._id)}
                                                disabled={actionInProgress === payment._id}
                                                className={`w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all ${actionInProgress === payment._id ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                title="Approve Payment"
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
                                                onClick={() => handleViewDetails(payment)}
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
                                    <p className="text-sm text-gray-500">Payment ID</p>
                                    <p className="font-mono text-sm font-medium">{selectedPayment.payment_id || selectedPayment._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Shipper Information</p>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium">{selectedPayment.shipper_name || "N/A"}</p>
                                    <p className="text-sm text-gray-600">{selectedPayment.shipper_email || "N/A"}</p>
                                    <p className="text-sm text-gray-600">{selectedPayment.shipper_phone || "N/A"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Shipment Information</p>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium">{selectedPayment.shipment_title || "N/A"}</p>
                                    <p className="text-sm text-gray-600">ID: {selectedPayment.shipment_id}</p>
                                    {selectedPayment.shipment_from && (
                                        <p className="text-sm text-gray-600">From: {selectedPayment.shipment_from}</p>
                                    )}
                                    {selectedPayment.shipment_to && (
                                        <p className="text-sm text-gray-600">To: {selectedPayment.shipment_to}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Request Date</p>
                                    <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="text-sm font-medium">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(selectedPayment.payment_method)}`}>
                                            {selectedPayment.payment_method || "N/A"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {selectedPayment.description && (
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="text-sm mt-1">{selectedPayment.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => handleApprove(selectedPayment._id)}
                                disabled={actionInProgress === selectedPayment._id}
                                className={`flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${actionInProgress === selectedPayment._id ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {actionInProgress === selectedPayment._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <CheckIcon className="w-4 h-4" />
                                )}
                                Approve Payment
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