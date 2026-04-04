// components/UserManagement.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";

export default function UserManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers(currentPage, itemsPerPage);
      
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.total);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to load users");
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

  // Format user type for display
  const formatUserType = (type) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Get user type color
  const getUserTypeColor = (type) => {
    switch(type?.toUpperCase()) {
      case 'TRANSPORTER':
        return 'bg-[#4F46E5]';
      case 'SHIPPER':
        return 'bg-[#A855F7]';
      case 'DRIVER':
        return 'bg-[#F59E0B]';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle view details
  const handleViewDetails = (userId, userType) => {
    router.push(`/admin/user-management/${userId}?type=${userType}`);
  };

  // Handle delete user
  const handleDelete = async (userId, userType) => {
    if (!confirm(`Are you sure you want to delete this ${formatUserType(userType)}?`)) {
      return;
    }
    
    try {
      setActionInProgress(userId);
      const response = await userAPI.deleteUser(userId, userType);
      
      if (response.success) {
        toast.success(`${formatUserType(userType)} deleted successfully!`);
        await fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setActionInProgress(null);
    }
  };

  // Search filtering logic
  const filteredUsers = users.filter((user) =>
    user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl min-h-[600px] flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            User Management ({totalUsers})
          </h2>
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="pl-9 pr-4 py-2 w-72 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#036BB4] text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-3 px-6 text-sm font-semibold first:rounded-l-md">User ID</th>
                <th className="py-3 px-6 text-sm font-semibold">Company/Name</th>
                <th className="py-3 px-6 text-sm font-semibold">Email</th>
                <th className="py-3 px-6 text-sm font-semibold">Phone</th>
                <th className="py-3 px-6 text-sm font-semibold">Registration Date</th>
                <th className="py-3 px-6 text-sm font-semibold text-center">User Type</th>
                {/* <th className="py-3 px-6 text-sm font-semibold text-center last:rounded-r-md">Action</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-700 font-mono">
                      {user._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">
                            {user.company_name ? user.company_name.charAt(0) : user.email?.charAt(0)}
                          </span>
                        </div>
                        {user.company_name || user.email?.split('@')[0] || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.email || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.phone || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(user.registrationDate)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-medium text-white gap-2 ${getUserTypeColor(user.userType)}`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        {formatUserType(user.userType)}
                      </span>
                    </td>
                    {/* <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleDelete(user._id, user.userType)}
                          disabled={actionInProgress === user._id}
                          className={`w-7 h-7 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group hover:bg-red-500 transition-all ${
                            actionInProgress === user._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete User"
                        >
                          {actionInProgress === user._id ? (
                            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4 text-red-500 group-hover:text-white" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleViewDetails(user._id, user.userType)}
                          className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 group hover:bg-purple-500 transition-all"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4 text-purple-500 group-hover:text-white" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-400 italic">
                    {searchTerm ? "No users found matching your search." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-8 pb-4">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 rounded-md transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#0169B2] text-white font-bold shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-300 font-bold">.....</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-[#036BB4] hover:bg-blue-50 transition-colors ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Show total count */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
        </div>
      )}
    </div>
  );
}