// components/ShipmentRequestApproval.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";

// Expanded Dummy Data
const shipmentRequests = [
  { id: "1", name: "Mason Brooks", email: "m.brooks@gmail.com", title: "Deliver wooden furniture set" },
  { id: "2", name: "Sarah Jenkins", email: "sarah.j@outlook.com", title: "Transport 50 crates of apples" },
  { id: "3", name: "Robert Fox", email: "fox.robert@gmail.com", title: "Electronics shipment (Lagos to Cotonou)" },
  { id: "4", name: "Esther Howard", email: "esther.h@gmail.com", title: "Move 12 pallets of cement" },
  { id: "5", name: "Cameron Williamson", email: "cam.will@yahoo.com", title: "Bulk textile delivery" },
  { id: "6", name: "Jerome Bell", email: "jebell@gmail.com", title: "Office furniture relocation" },
  { id: "7", name: "Jenny Wilson", email: "jenny.w@gmail.com", title: "Pharmaceutical supply run" },
  { id: "8", name: "Guy Hawkins", email: "guy.h@gmail.com", title: "Automotive parts transport" },
];

export default function ShipmentRequestApproval() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Search Filtering Logic
  const filteredData = shipmentRequests.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between shadow-sm border border-gray-100">
      <div>
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Shipment Request Approval</h2>
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                className="pl-9 pr-4 py-2 w-72 text-sm rounded-l-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <button className="bg-[#036BB4] p-2.5 rounded-r-md border border-[#036BB4] hover:bg-[#025a99] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M11 8H20M4 16H14M7 5V11M17 13V19" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 text-sm font-semibold first:rounded-l-md">Name</th>
                <th className="py-3 px-6 text-sm font-semibold">Email</th>
                <th className="py-3 px-6 text-sm font-semibold">Title</th>
                <th className="py-3 px-6 text-sm font-semibold text-center last:rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">{row.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{row.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{row.title}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        {/* Accept Button */}
                        <button className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 group hover:bg-green-500 transition-all shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-green-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                        {/* Reject Button */}
                        <button className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group hover:bg-red-500 transition-all shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-red-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        {/* View Details Button */}
                        <button 
                          onClick={() => router.push(`/admin/shipment-requests/${row.id}`)}
                          className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 group hover:bg-purple-500 transition-all shadow-sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-purple-500 group-hover:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400 italic">
                    No shipment requests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-end items-center gap-2 mt-8 pb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-md bg-[#0169B2] text-white font-bold shadow-md">1</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">2</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">3</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">4</button>
        <span className="px-2 text-gray-300 font-bold">.....</span>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">30</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}