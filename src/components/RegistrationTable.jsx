// components/RegistrationTable.js
"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";


const dummyRows = [
  {
    id: "reg-001",
    membershipId: "1234",
    name: "Truck Lagbe",
    avatar: "/path/to/avatar.png", 
    email: "@gmail.com",
    registrationDate: "March 15, 2024",
  },
  {
    id: "reg-002",
    membershipId: "1234",
    name: "Truck Lagbe",
    avatar: "/path/to/avatar.png",
    email: "@gmail.com",
    registrationDate: "March 15, 2024",
  },
  {
    id: "reg-003",
    membershipId: "1234",
    name: "Truck Lagbe",
    avatar: "/path/to/avatar.png",
    email: "@gmail.com",
    registrationDate: "March 15, 2024",
  },
  {
    id: "reg-004",
    membershipId: "1234",
    name: "Truck Lagbe",
    avatar: "/path/to/avatar.png",
    email: "@gmail.com",
    registrationDate: "March 15, 2024",
  },
];

export default function RiderRegistration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState(dummyRows);
  const router = useRouter();

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const newFilteredRows = dummyRows.filter(
      (row) =>
        row.membershipId.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.registrationDate.toLowerCase().includes(term)
    );
    setFilteredRows(newFilteredRows);
  };

  const handleView = (rowId) => router.push(`/admin/rider-registrations/${rowId}`);
  const handleDelete = (rowId) => alert(`Deleting: ${rowId}`);
  const handleEdit = (rowId) => alert(`Editing: ${rowId}`);

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_14.7px_0px_rgba(0,0,0,0.1)]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-black font-['Roboto']">
          Transporter Registrations
        </h2>

        <div className="flex items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-1.5 w-64 text-sm text-black rounded-l-md border border-gray-200 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {/* <button className="bg-[#036BB4] p-2 rounded-r-md border border-[#036BB4]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <th className="py-3 px-4 font-semibold text-sm first:rounded-l-md">Membership ID</th>
              <th className="py-3 px-4 font-semibold text-sm">Name</th>
              <th className="py-3 px-4 font-semibold text-sm text-center">Email</th>
              <th className="py-3 px-4 font-semibold text-sm text-center">Registration Date</th>
              <th className="py-3 px-4 font-semibold text-sm text-center last:rounded-r-md">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-gray-600 text-sm">{row.membershipId}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                      <Image src="/icon/truck-logo.png" alt="logo" width={20} height={20} className="opacity-70" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm">{row.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm text-center">{row.email}</td>
                <td className="py-4 px-4 text-gray-500 text-sm text-center">{row.registrationDate}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-3">
                    {/* Approve/Check Button */}
                    <button onClick={() => handleEdit(row.id)} className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    {/* Delete/X Button */}
                    <button onClick={() => handleDelete(row.id)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {/* View/Eye Button */}
                    <button onClick={() => handleView(row.id)} className="w-7 h-7 rounded-full bg-[#9900FF1A] text-[#9900FF] flex items-center justify-center hover:bg-purple-100">
                      <Image src="/eye.png" alt="View" width={14} height={14} className="opacity-70" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}