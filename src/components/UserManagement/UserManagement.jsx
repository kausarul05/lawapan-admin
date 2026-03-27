// components/UserManagement.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

const userData = [
  { id: "1234", name: "Mason Brooks", email: "@gmail.com", date: "March 15, 2024", type: "Transporter", img: "/avatar1.png" },
  { id: "1235", name: "Mason Brooks", email: "@gmail.com", date: "March 15, 2024", type: "Shipper", img: null },
];

export default function UserManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 w-64 text-sm rounded-l-md border border-gray-200 focus:outline-none text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <button className="bg-[#036BB4] p-2 rounded-r-md border border-[#036BB4] flex items-center justify-center">
               <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 text-sm font-semibold first:rounded-l-md">User ID</th>
                <th className="py-3 px-6 text-sm font-semibold">Name</th>
                <th className="py-3 px-6 text-sm font-semibold">Email</th>
                <th className="py-3 px-6 text-sm font-semibold">Registration Date</th>
                <th className="py-3 px-6 text-sm font-semibold text-center">User type</th>
                <th className="py-3 px-6 text-sm font-semibold text-center last:rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-700">{user.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      {user.img ? (
                        <img src={user.img} className="w-6 h-6 rounded-full" alt="avatar" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                      )}
                      {user.name}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.date}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-medium text-white gap-2 
                      ${user.type === 'Transporter' ? 'bg-[#4F46E5]' : 'bg-[#A855F7]'}`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group hover:bg-red-500 transition-all">
                        <TrashIcon className="h-4 w-4 text-red-500 group-hover:text-white" />
                      </button>
                      <button 
                        onClick={() => router.push(`/admin/user-management/${user.id}`)}
                        className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 group hover:bg-purple-500 transition-all"
                      >
                        <EyeIcon className="h-4 w-4 text-purple-500 group-hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Pagination Footer */}
      <div className="flex justify-end items-center gap-2 mt-8 pb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-md bg-[#0169B2] text-white font-bold">1</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">2</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">3</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">4</button>
        <span className="px-2 text-gray-300 font-bold">.....</span>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100">30</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}