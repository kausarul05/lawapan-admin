import React from 'react';
// Lucide-react is a great icon set that matches your screenshot perfectly
import { Search, Settings2, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const ProblemManagementTable = () => {
  return (
    <div className="w-full p-10 bg-white min-h-screen">
      
      {/* 1. Header & Search Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Problem Management..</h1>
        
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded-l-md px-3 py-1.5 bg-white">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="outline-none text-sm w-48 text-gray-600"
            />
          </div>
          {/* <button className="bg-[#0073B1] p-2 rounded-r-md text-white hover:bg-blue-700">
            <Settings2 className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* 2. Table Component */}
      <div className="overflow-hidden rounded-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0073B1] text-white">
              <th className="px-6 py-3 font-medium text-sm">Issue Title</th>
              <th className="px-6 py-3 font-medium text-sm">Shipment Id</th>
              <th className="px-6 py-3 font-medium text-sm text-center">User type</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Status</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-700">Deliver wooden furniture set</td>
              <td className="px-6 py-4 text-sm text-gray-500">#####</td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#4F6EF7] text-white text-xs">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                  Transporter
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#FF6B00] text-white text-xs">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                  Pending
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center space-x-4">
                  <button className="text-green-500 hover:scale-110 transition-transform">
                    <Check className="w-5 h-5" />
                  </button>
                  <button className="text-red-400 hover:scale-110 transition-transform">
                    <X className="w-5 h-5 border border-red-200 rounded-full p-0.5" />
                  </button>
                  <button className="text-purple-400 hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
      <div className="flex justify-end items-center mt-20 space-x-2">
        <button className="p-2 border border-blue-400 rounded-full text-blue-500 hover:bg-blue-50">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center bg-[#0073B1] text-white rounded-md text-sm">
          1
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-sm">
          2
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-sm">
          3
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-sm">
          4
        </button>
        
        <span className="px-2 text-gray-400 tracking-widest">.....</span>
        
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-sm">
          30
        </button>
        
        <button className="p-2 border border-blue-400 rounded-full text-blue-500 hover:bg-blue-50">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProblemManagementTable;
