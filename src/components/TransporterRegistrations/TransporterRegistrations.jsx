// components/TransporterRegistrations.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";

// Dummy data matching your image
const dummyRows = [
  { id: "1", company: "Truck Lagbe", email: "@gmail.com", date: "12 Jun 2025", status: "Pending" },
  { id: "2", company: "Truck Lagbe", email: "@gmail.com", date: "12 Jun 2025", status: "Pending" },
];

export default function TransporterRegistrations() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (id) => {
    router.push(`/admin/transporter-registration/${id}`);
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)] min-h-[600px] flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 font-['Roboto']">Transporter Registration</h2>
          
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 w-72 text-sm text-black rounded-l-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <button className="bg-[#036BB4] p-2.5 rounded-r-md border border-[#036BB4]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 8H20M4 16H14M7 5V11M17 13V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 font-semibold text-sm first:rounded-l-md">Company name</th>
                <th className="py-3 px-6 font-semibold text-sm">Email</th>
                <th className="py-3 px-6 font-semibold text-sm text-center">Applied Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-center last:rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dummyRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                         <div className="w-4 h-4 bg-[#036BB4] rounded-sm opacity-20" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{row.company}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{row.email}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm text-center">{row.date}</td>
                  <td className="py-4 px-6 text-center">
                    {/* Perfect Status Badge matching the orange in your image */}
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#FF6B00] text-white text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-2" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center border border-green-100 hover:bg-green-500 group transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-green-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                      <button className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center border border-red-100 hover:bg-red-500 group transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-red-500 group-hover:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      <button 
                        onClick={() => handleView(row.id)}
                        className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 hover:bg-purple-500 group transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-purple-500 group-hover:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer matching your image */}
      <div className="flex justify-end items-center gap-2 mt-8">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-md bg-[#036BB4] text-white font-bold">1</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">2</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">3</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">4</button>
        <span className="px-2 text-gray-300">.....</span>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">30</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
