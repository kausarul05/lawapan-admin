// app/admin/payment-requests-to-shipper/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { SendIcon } from "lucide-react";
import toast from "react-hot-toast";
import { paymentAPI } from "@/lib/api";

export default function PaymentRequestsToShipper() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalShipments, setTotalShipments] = useState(0);
    const [actionInProgress, setActionInProgress] = useState(null);
    const itemsPerPage = 10;

    // Fetch shipments awaiting payment
    useEffect(() => {
        fetchShipments();
    }, [currentPage]);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const response = await paymentAPI.getShipmentsAwaitingPayment(currentPage, itemsPerPage);

            console.log("API Response:", response);

            if (response.success) {
                setShipments(response.data || []);
                setTotalShipments(response.meta?.total || response.data?.length || 0);
                setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
            } else {
                toast.error(response.message || "Failed to fetch shipments");
            }
        } catch (error) {
            console.error("Error fetching shipments:", error);
            toast.error(error.message || "Failed to load shipments");
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (shipmentId) => {
        try {
            setActionInProgress(shipmentId);
            const response = await paymentAPI.sendPaymentRequestToShipper(shipmentId);

            if (response.success) {
                toast.success("Payment request sent to shipper successfully!");
                // Refresh the list
                await fetchShipments();
            } else {
                toast.error(response.message || "Failed to send payment request");
            }
        } catch (error) {
            console.error("Error sending payment request:", error);
            toast.error(error.message || "Failed to send payment request");
        } finally {
            setActionInProgress(null);
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

    // Filter shipments based on search term
    const filteredShipments = shipments.filter(shipment =>
        shipment.shipper_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.shipment_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment._id?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const currentShipments = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);
    const currentTotalPages = Math.ceil(filteredShipments.length / itemsPerPage);

    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading shipments...</p>
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
                            <h1 className="text-2xl font-bold text-gray-800">Payment Requests to Shipper</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Request payment from shippers for completed shipments
                                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    Total: {totalShipments}
                                </span>
                            </p>
                        </div>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by shipper, shipment or ID..."
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
                                <th className="py-3 px-6 rounded-l-md">Shipper</th>
                                <th className="py-3 px-6">Shipment</th>
                                <th className="py-3 px-6">Amount</th>
                                <th className="py-3 px-6">Request Date</th>
                                <th className="py-3 px-6">Status</th>
                                <th className="py-3 px-6 text-center rounded-r-md">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentShipments.length > 0 ? (
                                currentShipments.map((shipment) => (
                                    <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-800">
                                                {shipment.shipper_id?.company_name || "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ID: {shipment.shipper_id?._id?.slice(-8).toUpperCase() || "N/A"}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-medium text-gray-700">{shipment.shipment_title || "N/A"}</p>
                                            <p className="text-xs text-gray-500">ID: {shipment._id?.slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {shipment.pickup_address} → {shipment.delivery_address}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-green-600">
                                                {formatCurrency(shipment.price)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {formatDate(shipment.createdAt)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                                                Awaiting Payment
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleSendRequest(shipment._id)}
                                                disabled={actionInProgress === shipment._id}
                                                className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 mx-auto transition-all ${actionInProgress === shipment._id ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                {actionInProgress === shipment._id ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <SendIcon className="w-4 h-4" />
                                                )}
                                                {actionInProgress === shipment._id ? "Sending..." : "Send Request"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                        {searchTerm ? "No shipments found matching your search." : "No shipments awaiting payment found."}
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
                {filteredShipments.length > 0 && (
                    <div className="px-6 pb-4 text-sm text-gray-500 text-right">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredShipments.length)} of {filteredShipments.length} shipments
                    </div>
                )}
            </div>
        </div>
    );
}