// app/admin/shipment-request/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { shipmentAPI } from "@/lib/api";

export default function ShipmentDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Fetch shipment details
  useEffect(() => {
    if (id) {
      fetchShipmentDetails();
    }
  }, [id]);

  const fetchShipmentDetails = async () => {
    try {
      setLoading(true);
      const response = await shipmentAPI.getShipmentById(id);
      
      if (response.success) {
        setShipment(response.data.shipment);
        // Set images from API response
        if (response.data.shipment.shipment_images) {
          setImages(response.data.shipment.shipment_images);
        }
      } else {
        toast.error(response.message || "Failed to fetch shipment details");
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
      toast.error(error.message || "Failed to load shipment details");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format dimensions
  const formatDimensions = (dimensions) => {
    if (!dimensions) return "N/A";
    return dimensions;
  };

  // Slider navigation
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-slide effect
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, images.length]);

  // Handle approve
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const response = await shipmentAPI.approveShipment(id);
      
      if (response.success) {
        toast.success("Shipment approved and moved to bidding!");
        await fetchShipmentDetails();
        router.push('/admin/shipment-requests');
      } else {
        toast.error(response.message || "Failed to approve shipment");
      }
    } catch (error) {
      console.error("Error approving shipment:", error);
      toast.error(error.message || "Failed to approve shipment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    try {
      setActionLoading(true);
      const response = await shipmentAPI.rejectShipment(id);
      
      if (response.success) {
        toast.success("Shipment rejected successfully!");
        await fetchShipmentDetails();
        router.push('/admin/shipment-requests');
      } else {
        toast.error(response.message || "Failed to reject shipment");
      }
    } catch (error) {
      console.error("Error rejecting shipment:", error);
      toast.error(error.message || "Failed to reject shipment");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen font-['Roboto'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!shipment) {
    return (
      <div className="p-8 bg-white min-h-screen font-['Roboto']">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Shipment Detail</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Shipment not found</p>
        </div>
      </div>
    );
  }

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
        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
            shipment.status === 'PENDING' 
              ? 'bg-yellow-100 text-yellow-800' 
              : shipment.status === 'BIDDING'
              ? 'bg-blue-100 text-blue-800'
              : shipment.status === 'IN_PROGRESS'
              ? 'bg-purple-100 text-purple-800'
              : shipment.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {shipment.status || 'PENDING'}
          </span>
        </div>

        {/* Auto-Slider Section */}
        {images.length > 0 && (
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
                  <img 
                    src={img}
                    alt={`Shipment item ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Pagination Dots */}
              {images.length > 1 && (
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
              )}
            </div>

            <button 
              onClick={nextSlide}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all opacity-50 group-hover:opacity-100"
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Shipment Title</p>
                <p className="text-gray-900 font-bold">{shipment.shipment_title || "N/A"}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Category</p>
                <p className="text-gray-900 font-bold">{shipment.category || "N/A"}</p>
              </div>
            </div>
            <div className="p-5 border-b border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Description</p>
              <p className="text-gray-900 font-bold">{shipment.discription || "N/A"}</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Weight</p>
                <p className="text-gray-900 font-bold">{shipment.weight || "N/A"}</p>
              </div>
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Packaging Type</p>
                <p className="text-gray-900 font-bold">{shipment.type_of_packaging || "N/A"}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Dimensions (L/W/H)</p>
                <p className="text-gray-900 font-bold">{formatDimensions(shipment.dimensions)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup & Delivery Details Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pickup & Delivery Details</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Pickup Address</p>
                <p className="text-gray-900 font-bold">{shipment.pickup_address || "N/A"}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Time Window</p>
                <p className="text-gray-900 font-bold">{shipment.time_window || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                <p className="text-gray-900 font-bold">{shipment.delivery_address || "N/A"}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Contact Person</p>
                <p className="text-gray-900 font-bold">{shipment.contact_person || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Date Preference</p>
                <p className="text-gray-900 font-bold">{formatDate(shipment.date_preference)}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Price</p>
                <p className="text-green-600 font-bold text-lg">{formatPrice(shipment.price)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section - Only show if status is PENDING */}
        {shipment.status === 'PENDING' && (
          <div className="flex gap-4 mb-10">
            <button 
              onClick={handleApprove}
              disabled={actionLoading}
              className={`flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {actionLoading ? "Processing..." : "Accept Shipment"}
            </button>
            
            <button 
              onClick={handleReject}
              disabled={actionLoading}
              className={`flex-1 bg-white border-2 border-red-500 hover:bg-red-50 text-red-500 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              {actionLoading ? "Processing..." : "Reject Shipment"}
            </button>
          </div>
        )}

        {/* Show message if already processed */}
        {shipment.status !== 'PENDING' && (
          <div className={`p-4 rounded-lg text-center ${
            shipment.status === 'BIDDING' 
              ? 'bg-blue-50 text-blue-800 border border-blue-200' 
              : shipment.status === 'IN_PROGRESS'
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : shipment.status === 'COMPLETED'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="font-semibold">
              This shipment has been {shipment.status.toLowerCase()} on {formatDate(shipment.updatedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}