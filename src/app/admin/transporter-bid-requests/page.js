// app/admin/transporter-bid-requests/page.js
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

const fakeBidRequests = [
  {
    _id: "bid_001",
    transporter_name: "FastTrack Logistics",
    transporter_email: "dispatch@fasttrack.com",
    transporter_phone: "+1 (555) 111-2222",
    shipment_title: "Electronics Delivery - NY to Boston",
    shipment_id: "SHIP-001",
    bid_amount: 2450.00,
    bid_date: "2024-01-20T09:30:00Z",
    status: "pending",
    vehicle_type: "Box Truck",
    estimated_delivery: "3 days"
  },
  {
    _id: "bid_002",
    transporter_name: "Highway Haulers",
    transporter_email: "contact@highwayhaulers.com",
    transporter_phone: "+1 (555) 333-4444",
    shipment_title: "Furniture Transport - Chicago to Detroit",
    shipment_id: "SHIP-002",
    bid_amount: 3600.00,
    bid_date: "2024-01-21T11:15:00Z",
    status: "pending",
    vehicle_type: "Flatbed",
    estimated_delivery: "2 days"
  },
  {
    _id: "bid_003",
    transporter_name: "Express Cargo Services",
    transporter_email: "operations@expresscargo.com",
    transporter_phone: "+1 (555) 555-6666",
    shipment_title: "Medical Supplies - Florida to Georgia",
    shipment_id: "SHIP-003",
    bid_amount: 5100.00,
    bid_date: "2024-01-22T14:45:00Z",
    status: "pending",
    vehicle_type: "Refrigerated Truck",
    estimated_delivery: "1 day"
  },
  {
    _id: "bid_004",
    transporter_name: "Reliable Transport Co",
    transporter_email: "info@reliable.com",
    transporter_phone: "+1 (555) 777-8888",
    shipment_title: "Construction Equipment - Texas to Oklahoma",
    shipment_id: "SHIP-004",
    bid_amount: 8700.00,
    bid_date: "2024-01-23T08:20:00Z",
    status: "pending",
    vehicle_type: "Heavy Hauler",
    estimated_delivery: "4 days"
  },
  {
    _id: "bid_005",
    transporter_name: "Swift Delivery Solutions",
    transporter_email: "dispatch@swift.com",
    transporter_phone: "+1 (555) 999-0000",
    shipment_title: "Retail Goods - Washington to Oregon",
    shipment_id: "SHIP-005",
    bid_amount: 1900.00,
    bid_date: "2024-01-24T16:30:00Z",
    status: "pending",
    vehicle_type: "Cargo Van",
    estimated_delivery: "2 days"
  }
];

export default function TransporterBidRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  const formatDate = (dateString) => {
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleApprove = async (bidId) => {
    setActionInProgress(bidId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Bid request approved! Shipper will be notified.");
    setActionInProgress(null);
  };

  const handleReject = async (bidId) => {
    setActionInProgress(bidId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Bid request rejected.");
    setActionInProgress(null);
  };

  const handleViewDetails = (bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };

  const filteredBids = fakeBidRequests.filter(bid =>
    bid.transporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bid.shipment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bid.shipment_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBids = filteredBids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Transporter Bid Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Review and manage transporter bids for shipments</p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transporter or shipment..."
                className="pl-9 pr-4 py-2 w-80 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4]"
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
                <th className="py-3 px-6 text-sm font-semibold rounded-l-md">Transporter</th>
                <th className="py-3 px-6 text-sm font-semibold">Shipment</th>
                <th className="py-3 px-6 text-sm font-semibold">Bid Amount</th>
                <th className="py-3 px-6 text-sm font-semibold">Vehicle Type</th>
                <th className="py-3 px-6 text-sm font-semibold">Bid Date</th>
                <th className="py-3 px-6 text-sm font-semibold text-center">Status</th>
                <th className="py-3 px-6 text-sm font-semibold text-center rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentBids.map((bid) => (
                <tr key={bid._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{bid.transporter_name}</p>
                      <p className="text-xs text-gray-500">{bid.transporter_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">{bid.shipment_title}</p>
                    <p className="text-xs text-gray-500">ID: {bid.shipment_id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-green-600">{formatCurrency(bid.bid_amount)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-700">{bid.vehicle_type}</span>
                    <p className="text-xs text-gray-500">Est: {bid.estimated_delivery}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{formatDate(bid.bid_date)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleApprove(bid._id)} disabled={actionInProgress === bid._id}
                        className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                        {actionInProgress === bid._id ? <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div> : <CheckIcon className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleReject(bid._id)} disabled={actionInProgress === bid._id}
                        className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        {actionInProgress === bid._id ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <XMarkIcon className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleViewDetails(bid)} className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-500 hover:bg-purple-500 hover:text-white transition-all">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-6 border-t border-gray-200">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i;
              if (pageNum <= totalPages) return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md transition-colors ${currentPage === pageNum ? 'bg-[#036BB4] text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showModal && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Bid Request Details</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Transporter</p><p className="font-medium">{selectedBid.transporter_name}</p></div>
                <div><p className="text-sm text-gray-500">Bid Amount</p><p className="text-xl font-bold text-green-600">{formatCurrency(selectedBid.bid_amount)}</p></div>
              </div>
              <div><p className="text-sm text-gray-500">Shipment</p><p className="font-medium">{selectedBid.shipment_title}</p><p className="text-sm text-gray-600">ID: {selectedBid.shipment_id}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Vehicle Type</p><p className="font-medium">{selectedBid.vehicle_type}</p></div>
                <div><p className="text-sm text-gray-500">Estimated Delivery</p><p className="font-medium">{selectedBid.estimated_delivery}</p></div>
              </div>
              <div><p className="text-sm text-gray-500">Contact Information</p><p className="font-medium">{selectedBid.transporter_email}</p><p className="text-sm">{selectedBid.transporter_phone}</p></div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => handleApprove(selectedBid._id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"><CheckIcon className="w-4 h-4" /> Approve Bid</button>
              <button onClick={() => handleReject(selectedBid._id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"><XMarkIcon className="w-4 h-4" /> Reject Bid</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}