// app/admin/user-management/[id]/page.js
"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";

export default function UserDetailPage() {
  const router = useRouter();

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Transporter Profile Detail</h1>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 bg-[#FF6B00] text-white text-xs font-bold rounded-full gap-1.5">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          Pending
        </span>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-gray-100 overflow-hidden mb-4 p-2 bg-[#F8FAFC]">
            <img src="/truck-logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Truck Lagbe</h2>
      </div>

      {/* Information Card */}
      <div className="max-w-4xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {/* Row 1 */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Email adress</p>
              <p className="text-gray-900 font-bold">@gmail.com</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">Phone</p>
              <p className="text-gray-900 font-bold">01797111139</p>
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Country</p>
              <div className="flex items-center gap-2">
                <span className="w-5 h-3 bg-[#E5E7EB]">🇧🇯</span>
                <p className="text-gray-900 font-bold">Benin</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">Number of Trucks</p>
              <p className="text-gray-900 font-bold">20</p>
            </div>
          </div>
          {/* Row 3 */}
          <div className="p-5">
            <p className="text-gray-400 text-sm mb-1">Truck Type</p>
            <div className="flex items-center gap-2">
               <span className="text-gray-500">🚚</span>
               <p className="text-gray-900 font-bold">Semi-trailer</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
          <button className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
            </div>
            Accept
          </button>
          <button className="flex-1 bg-white border border-red-500 text-red-500 hover:bg-red-50 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all">
             <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
                <XMarkIcon className="w-3 h-3 text-red-500" />
            </div>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}