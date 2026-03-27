// app/admin/shipment-request/[id]/page.js
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ShipmentDetail() {
  const router = useRouter();
  
  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/shipments-image-1.jpg",
    "/shipments-image-2.jpg",
    "/shipments-image-3.jpg",
    "/furniture-sample.png",
  ];

  // Logic for manual navigation
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000); // Slides every 3 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [nextSlide]);

  return (
    <div className="p-8 bg-white min-h-screen font-['Roboto']">
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Shipment Detail</h1>
      </div>

      <div className="max-w-5xl">
        {/* Auto-Slider Section */}
        <div className="flex items-center gap-4 mb-10 group">
          <button 
            onClick={prevSlide}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all opacity-50 group-hover:opacity-100"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
          </button>

          <div className="relative w-[378px] h-[208px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image 
                  src={img}
                  alt={`Shipment item ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                    ? "w-3 h-3 bg-white" 
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all opacity-50 group-hover:opacity-100"
          >
            <ArrowRightIcon className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Basic Information Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Shipment title</p>
                <p className="text-gray-900 font-bold">Ship 12 Pallets of Rice</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Category</p>
                <p className="text-gray-900 font-bold">Furniture</p>
              </div>
            </div>
            <div className="p-5 border-b border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Description</p>
              <p className="text-gray-900 font-bold">12 shrink-wrapped pallets, non-fragile</p>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Weight</p>
                <p className="text-gray-900 font-bold">2,300 kg</p>
              </div>
              <div className="p-5">
                <p className="text-red-500 text-sm mb-1">Dimensions (L/W/H) (kg)</p>
                <p className="text-red-500 font-bold">120 cm / 100 cm / 160 cm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup & Delivery Details Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pickup & Delivery Details</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Pickup Address</p>
                <p className="text-gray-900 font-bold">Rue 14.12, Ouagadougou</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Time Window</p>
                <p className="text-gray-900 font-bold">12:00 am</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                <p className="text-gray-900 font-bold">Rue 14.12, Ouagadougou</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Contact Person</p>
                <p className="text-gray-900 font-bold">Sunan Rahman</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">Date Preference</p>
              <p className="text-gray-900 font-bold">Flexible within 2 days</p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-4 mb-10">
          <button className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Accept
          </button>
          <button className="flex-1 bg-white border-2 border-red-500 hover:bg-red-50 text-red-500 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
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