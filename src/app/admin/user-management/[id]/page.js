// app/admin/user-management/[id]/page.js
"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";

export default function UserDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;
  const userType = searchParams.get('type');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch user details
  useEffect(() => {
    if (id && userType) {
      fetchUserDetails();
    }
  }, [id, userType]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id, userType);
      
      console.log("response xxxx", response)
      
      if (response.success) {
        setUser(response.data);
      } else {
        toast.error(response.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error(error.message || "Failed to load user details");
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

  // Format user type
  const formatUserType = (type) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-[#FF6B00]';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle accept
  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const response = await userAPI.approveUser(id, userType);
      
      if (response.success) {
        toast.success(`${formatUserType(userType)} approved successfully!`);
        await fetchUserDetails();
      } else {
        toast.error(response.message || "Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error(error.message || "Failed to approve user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    try {
      setActionLoading(true);
      const response = await userAPI.rejectUser(id, userType);
      
      if (response.success) {
        toast.success(`${formatUserType(userType)} rejected successfully!`);
        await fetchUserDetails();
      } else {
        toast.error(response.message || "Failed to reject user");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error(error.message || "Failed to reject user");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!user) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-[#E0F2FE] rounded-full hover:bg-blue-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-[#036BB4]" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">User Profile Detail</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  // Check if user is a transporter or shipper
  const isTransporter = userType === 'TRANSPORTER';
  const isShipper = userType === 'SHIPPER';
  
  // Get display name
  const displayName = isTransporter ? user.company_name : 
                      isShipper ? user.company_name : 
                      user.email?.split('@')[0] || "N/A";

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
        <h1 className="text-xl font-bold text-gray-800">
          {formatUserType(userType)} Profile Detail
        </h1>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 ${getStatusColor(user.status)} text-white text-xs font-bold rounded-full gap-1.5`}>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          {user.status || "Pending"}
        </span>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-gray-100 overflow-hidden mb-4 p-2 bg-[#F8FAFC] flex items-center justify-center">
          {user.logo ? (
            <img src={user.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-[#036BB4] text-white flex items-center justify-center text-3xl font-bold">
              {displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
        <p className="text-gray-500 text-sm mt-1">User ID: {id?.slice(-8).toUpperCase()}</p>
      </div>

      {/* Information Card */}
      <div className="max-w-4xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {/* Row 1 - Email & Phone */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Email Address</p>
              <p className="text-gray-900 font-bold">{user.email || "N/A"}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">Phone</p>
              <p className="text-gray-900 font-bold">{user.phone || "N/A"}</p>
            </div>
          </div>
          
          {/* Row 2 - Registration Date & User Type */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-sm mb-1">Registration Date</p>
              <p className="text-gray-900 font-bold">{formatDate(user.registrationDate || user.createdAt)}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">User Type</p>
              <p className="text-gray-900 font-bold">{formatUserType(userType)}</p>
            </div>
          </div>

          {/* Transporter Specific Fields */}
          {isTransporter && (
            <>
              <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="p-5 border-r border-gray-100">
                  <p className="text-gray-400 text-sm mb-1">Number of Trucks</p>
                  <p className="text-gray-900 font-bold">{user.number_of_trucks || user.totalVehicles || "N/A"}</p>
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-1">Truck Type</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🚚</span>
                    <p className="text-gray-900 font-bold">
                      {user.truck_type?.replace(/_/g, ' ') || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              {user.country && (
                <div className="p-5 border-b border-gray-100">
                  <p className="text-gray-400 text-sm mb-1">Country</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🌍</span>
                    <p className="text-gray-900 font-bold">{user.country}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Shipper Specific Fields */}
          {isShipper && (
            <>
              {user.company_name && (
                <div className="p-5 border-b border-gray-100">
                  <p className="text-gray-400 text-sm mb-1">Company Name</p>
                  <p className="text-gray-900 font-bold">{user.company_name}</p>
                </div>
              )}
              {user.address && (
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-1">Address</p>
                  <p className="text-gray-900 font-bold">{user.address}</p>
                </div>
              )}
            </>
          )}

          {/* Driver Specific Fields */}
          {userType === 'DRIVER' && (
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-1">Driver Information</p>
              <p className="text-gray-900 font-bold">License: {user.license_number || "N/A"}</p>
            </div>
          )}
        </div>

        {/* Action Buttons - Only show if status is pending */}
        {user.status === 'pending' && (
          <div className="mt-10 flex gap-4">
            <button 
              onClick={handleAccept}
              disabled={actionLoading}
              className={`flex-1 bg-[#4CAF50] hover:bg-green-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              {actionLoading ? "Processing..." : "Accept"}
            </button>
            <button 
              onClick={handleReject}
              disabled={actionLoading}
              className={`flex-1 bg-white border border-red-500 text-red-500 hover:bg-red-50 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
                <XMarkIcon className="w-3 h-3 text-red-500" />
              </div>
              {actionLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        )}

        {/* Show message if already processed */}
        {user.status !== 'pending' && user.status && (
          <div className={`mt-10 p-4 rounded-lg text-center ${
            user.status === 'approved' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="font-semibold">
              This {formatUserType(userType)} has been {user.status} on {formatDate(user.updatedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}