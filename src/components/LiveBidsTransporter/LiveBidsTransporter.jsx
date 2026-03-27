// components/LiveBidsTransporter.jsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Check, 
  MinusCircle 
} from 'lucide-react';

const LiveBidsTransporter = () => {
  // Dummy data for the shipment cards
  const shipments = Array(5).fill({
    title: "Ship 12 Pallets of Rice",
    status: "Open",
    image: "/shipment-sample.jpg" // Replace with your actual image path
  });

  // Dummy data for the bids table
  const bids = Array(8).fill({
    bidder: "Truck Lagbe",
    price: "€150.00",
    logo: "/truck-logo.png" // Replace with your actual logo path
  });

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Live Bids & Assigned transporter</h2>
        <div className="flex gap-2">
          <button className="p-1 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 2. Horizontal Shipment Cards Slider */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {shipments.map((ship, idx) => (
          <div key={idx} className="relative min-w-[220px] h-[130px] rounded-xl overflow-hidden shadow-md">
            {/* Background Image Placeholder (using a colored div if image is missing) */}
            <div className="absolute inset-0 bg-gray-600">
                <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400')] bg-cover bg-center" />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <MinusCircle size={10} /> Remove
              </span>
              <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Open
              </span>
            </div>
            
            {/* Title */}
            <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
              {ship.title}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. Bids Table Section */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg">Bids</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#036BB4] text-white text-sm">
                  <th className="py-3 px-6 font-semibold">Bidders</th>
                  <th className="py-3 px-6 font-semibold">Price</th>
                  <th className="py-3 px-6 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bids.map((bid, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100">
                           <span className="text-[10px] text-blue-600 font-bold">TL</span>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{bid.bidder}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 font-semibold">{bid.price}</td>
                    <td className="py-3 px-6">
                      <div className="flex justify-center gap-3">
                        <button className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                          <Check size={14} strokeWidth={3} />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-400 hover:bg-purple-500 hover:text-white transition-all">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Assigned Transporter Placeholder Section */}
        <div className="border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="mb-6 relative w-48 h-48">
            {/* Hourglass Illustration Placeholder */}
            <div className="w-full h-full flex items-center justify-center text-blue-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32 opacity-80">
                    <path d="M5 2h14v5l-4 4 4 4v5H5v-5l4-4-4-4V2z" />
                    <path d="M9 2v5l3 3 3-3V2M9 22v-5l3-3 3 3v5" />
                    <path d="M8 6h8M8 18h8" />
                </svg>
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Finding the Best Match for Your Shipment</h3>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
            We are actively working to assign the best-matched and most reliable transporter for your needs.
          </p>
        </div>
      </div>

      {/* 5. Pagination Footer */}
      <div className="flex justify-end items-center gap-2 mt-8">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50">
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 rounded-md bg-[#036BB4] text-white font-bold text-sm">1</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 text-sm">2</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 text-sm">3</button>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 text-sm">4</button>
        <span className="px-2 text-gray-300">.....</span>
        <button className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 text-sm">30</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50">
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LiveBidsTransporter;