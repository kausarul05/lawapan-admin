// app/admin/transporter-registration/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { transporterAPI } from "@/lib/api";

export default function TransporterRegistrationDetails() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch transporter details
  useEffect(() => {
    if (id) {
      fetchTransporterDetails();
    }
  }, [id]);

  const fetchTransporterDetails = async () => {
    try {
      setLoading(true);
      const response = await transporterAPI.getTransporterById(id);

      if (response.success) {
        setTransporter(response.data);
      } else {
        toast.error(response.message || "Failed to fetch transporter details");
      }
    } catch (error) {
      console.error("Error fetching transporter details:", error);
      toast.error(error.message || "Failed to load transporter details");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get status badge color and styles
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { color: 'bg-green-500', text: 'Approved' };
      case 'pending':
        return { color: 'bg-[#FF6B00]', text: 'Pending' };
      case 'rejected':
        return { color: 'bg-red-500', text: 'Rejected' };
      default:
        return { color: 'bg-gray-500', text: status || 'Unknown' };
    }
  };

  // Format truck type
  const formatTruckType = (truckType) => {
    if (!truckType) return "N/A";
    return truckType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle accept - Updated to use transporter_id
  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const response = await transporterAPI.approveTransporter(id);

      if (response.success) {
        toast.success("Transporter approved successfully!");
        await fetchTransporterDetails();
      } else {
        toast.error(response.message || "Failed to approve transporter");
      }
    } catch (error) {
      console.error("Error approving transporter:", error);
      toast.error(error.message || "Failed to approve transporter");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject - Updated to use transporter_id
  const handleReject = async () => {
    try {
      setActionLoading(true);
      const response = await transporterAPI.rejectTransporter(id);

      if (response.success) {
        toast.success("Transporter rejected successfully!");
        await fetchTransporterDetails();
      } else {
        toast.error(response.message || "Failed to reject transporter");
      }
    } catch (error) {
      console.error("Error rejecting transporter:", error);
      toast.error(error.message || "Failed to reject transporter");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-[#F9FAFB] min-h-screen font-['Roboto'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transporter details...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!transporter) {
    return (
      <div className="p-8 bg-[#F9FAFB] min-h-screen font-['Roboto']">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Transporter Profile Detail</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Transporter not found</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transporter.status);

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

      <div className="max-w-6xl mx-auto">
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-4 py-1 rounded-full ${statusConfig.color} text-white text-[12px] font-bold`}>
            <span className="w-2 h-2 bg-white rounded-full mr-2" />
            {statusConfig.text}
          </span>
        </div>

        {/* Profile Image & Name */}
        <div className="flex flex-col items-start gap-4 mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-gray-100 bg-[#F0FDF4] flex items-center justify-center overflow-hidden shadow-sm">
            {transporter.logo ? (
              <img
                src={transporter.logo}
                alt={transporter.company_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/100x100/036BB4/FFFFFF?text=Logo";
                }}
              />
            ) : (
              <div className="text-[#036BB4] opacity-80">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M1 3h15v13H1zM16 8l4 0l3 3l0 5l-7 0" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{transporter.company_name || "N/A"}</h2>
        </div>

        {/* Basic Information Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {/* Row 1 - Email & Phone */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Email Address</p>
                <p className="text-gray-900 font-bold font-['Roboto']">
                  {transporter.email || "N/A"}
                </p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Phone</p>
                <p className="text-gray-900 font-bold font-['Roboto']">
                  {transporter.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Row 2 - Country & Number of Trucks */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Country</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-bold">{transporter.country || "N/A"}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Total Trucks</p>
                <p className="text-gray-900 font-bold">{transporter.totalVehicles || transporter.number_of_trucks || 0}</p>
              </div>
            </div>

            {/* Row 3 - Truck Type & Total Earning */}
            <div className="grid grid-cols-2">
              <div className="p-5 border-r border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Truck Type</p>
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <path d="M1 3h15v13H1zM16 8l4 0l3 3l0 5l-7 0" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <p className="text-gray-900 font-bold">{formatTruckType(transporter.truck_type)}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                <p className="text-green-600 font-bold text-lg">{formatCurrency(transporter.totalEarning)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900">{transporter.totalVehicles || transporter.number_of_trucks || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#036BB4" strokeWidth="2">
                    <path d="M1 3h15v13H1zM16 8l4 0l3 3l0 5l-7 0" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">{transporter.totalCompletedShipments || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
                    <path d="M3 12h2l3-9 4 18 3-9h2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(transporter.totalEarning)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA000" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Section */}
        {transporter.vehicles && transporter.vehicles.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicles ({transporter.vehicles.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transporter.vehicles.map((vehicle, index) => (
                <div key={vehicle._id || index} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Vehicle Number</p>
                        <p className="text-gray-900 font-bold">{vehicle.vehicle_number}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        {vehicle.vehicle_type}
                      </span>
                    </div>
                  </div>

                  {vehicle.vehicle_images && vehicle.vehicle_images.length > 0 && (
                    <div className="p-5">
                      <p className="text-gray-400 text-sm mb-3">Vehicle Images</p>
                      <div className="grid grid-cols-2 gap-3">
                        {vehicle.vehicle_images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`Vehicle ${vehicle.vehicle_number} - ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Date */}
        {transporter.createdAt && (
          <div className="mb-10">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-1">Registration Date</p>
                <p className="text-gray-900 font-bold">{formatDate(transporter.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Only show if status is pending */}
        {/* {transporter.status === 'pending' && ( */}
        <div className="flex gap-4 items-center sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <button
            onClick={handleAccept}
            disabled={actionLoading}
            className={`flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {actionLoading ? "Processing..." : "Accept Registration"}
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading}
            className={`flex-1 bg-white border-2 border-red-500 hover:bg-red-50 text-red-500 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            {actionLoading ? "Processing..." : "Reject Registration"}
          </button>
        </div>
        {/* )} */}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size vehicle"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}