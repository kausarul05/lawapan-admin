// app/admin/payment-requests-to-shipper/page.js
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SendIcon } from "lucide-react";
import React, { useState } from "react";
// import { MagnifyingGlassIcon, SendIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const fakePaymentRequests = [
    { _id: "req_001", shipper_name: "John Smith", shipper_email: "john.smith@example.com", shipment_title: "Electronics Shipment", shipment_id: "SHIP-001", amount: 2500.00, request_date: "2024-01-25T10:30:00Z", status: "pending", payment_method: "Bank Transfer" },
    { _id: "req_002", shipper_name: "Sarah Johnson", shipper_email: "sarah.j@example.com", shipment_title: "Furniture Transport", shipment_id: "SHIP-002", amount: 3750.50, request_date: "2024-01-26T14:20:00Z", status: "pending", payment_method: "Credit Card" },
    { _id: "req_003", shipper_name: "Michael Brown", shipper_email: "michael.b@example.com", shipment_title: "Medical Supplies", shipment_id: "SHIP-003", amount: 5200.00, request_date: "2024-01-27T09:15:00Z", status: "pending", payment_method: "Digital Payment" }
];

export default function PaymentRequestsToShipper() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [actionInProgress, setActionInProgress] = useState(null);
    const itemsPerPage = 10;

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const handleSendRequest = async (requestId) => {
        setActionInProgress(requestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Payment request sent to shipper successfully!");
        setActionInProgress(null);
    };

    const filteredRequests = fakePaymentRequests.filter(r => r.shipper_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.shipment_title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div><h1 className="text-2xl font-bold text-gray-800">Payment Requests to Shipper</h1><p className="text-gray-500 text-sm mt-1">Request payment from shippers for completed shipments</p></div>
                        <div className="relative"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search by shipper or shipment..." className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-[#036BB4] text-white"><th className="py-3 px-6 rounded-l-md">Shipper</th><th className="py-3 px-6">Shipment</th><th className="py-3 px-6">Amount</th><th className="py-3 px-6">Request Date</th><th className="py-3 px-6 text-center rounded-r-md">Action</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentRequests.map((req) => (<tr key={req._id} className="hover:bg-gray-50"><td className="py-4 px-6"><p className="font-medium">{req.shipper_name}</p><p className="text-xs text-gray-500">{req.shipper_email}</p></td><td className="py-4 px-6"><p className="text-sm">{req.shipment_title}</p><p className="text-xs text-gray-500">ID: {req.shipment_id}</p></td><td className="py-4 px-6"><span className="font-bold text-green-600">{formatCurrency(req.amount)}</span></td><td className="py-4 px-6 text-sm text-gray-500">{formatDate(req.request_date)}</td><td className="py-4 px-6 text-center"><button onClick={() => handleSendRequest(req._id)} disabled={actionInProgress === req._id} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 mx-auto"><SendIcon className="w-4 h-4" /> {actionInProgress === req._id ? "Sending..." : "Send Request"}</button></td></tr>))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && <div className="flex justify-end items-center gap-2 p-6 border-t border-gray-200">...</div>}
            </div>
        </div>
    );
}