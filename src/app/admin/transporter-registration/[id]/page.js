// app/admin/transporter-registration/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TransporterRegistrationDetails() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen font-['Roboto']">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Transporter Profile Detail</h1>
      </div>

      <div className="max-w-5xl">
        {/* Status Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#FF6B00] text-white text-[12px] font-bold">
            <span className="w-2 h-2 bg-white rounded-full mr-2" />
            Pending
          </span>
        </div>

        {/* Profile Image & Name */}
        <div className="flex flex-col items-start gap-4 mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-gray-100 bg-[#F0FDF4] flex items-center justify-center overflow-hidden shadow-sm">
             {/* Replace with actual logo logic */}
             <div className="text-[#036BB4] opacity-80">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M1 3h15v13H1zM16 8l4 0l3 3l0 5l-7 0" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
             </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Truck Lagbe</h2>
        </div>

        {/* Basic Information Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {/* Row 1 */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Email adress</p>
                <p className="text-gray-900 font-bold font-['Roboto']">@gmail.com</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Phone</p>
                <p className="text-gray-900 font-bold font-['Roboto']">01797111139</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Country</p>
                <div className="flex items-center gap-2">
                   <div className="w-5 h-3 bg-green-600 relative">
                      <div className="absolute top-0 left-0 w-1/3 h-full bg-yellow-400" />
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600" />
                   </div>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                   <path d="M1 3h15v13H1zM16 8l4 0l3 3l0 5l-7 0" />
                </svg>
                <p className="text-gray-900 font-bold">Semi-trailer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          <button className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Accept
          </button>
          
          <button className="flex-1 bg-white border-2 border-red-500 hover:bg-red-50 text-red-500 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all">
             <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                 <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
               </svg>
             </div>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}