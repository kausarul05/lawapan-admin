// components/ProblemManagementTable.js
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { problemAPI } from '@/lib/api';

const ProblemManagementTable = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);
  const [actionInProgress, setActionInProgress] = useState(null);
  const itemsPerPage = 10;

  // Fetch issues
  useEffect(() => {
    fetchIssues();
  }, [currentPage, searchTerm]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await problemAPI.getAllIssues(currentPage, itemsPerPage, searchTerm);

      console.log("API Response:", response);

      if (response.success) {
        setIssues(response.data || []);
        setTotalIssues(response.meta?.total || response.data?.length || 0);
        setTotalPages(response.meta?.totalPage || Math.ceil((response.meta?.total || response.data?.length) / itemsPerPage) || 1);
      } else {
        toast.error(response.message || "Failed to fetch issues");
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error(error.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get user type badge color
  const getUserTypeColor = (userType) => {
    switch (userType?.toUpperCase()) {
      case 'TRANSPORTER':
        return 'bg-[#4F6EF7]';
      case 'SHIPPER':
        return 'bg-purple-500';
      case 'DRIVER':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-[#FF6B00]';
      case 'resolved':
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAccept = async (issueId) => {
    try {
      setActionInProgress(issueId);
      const response = await problemAPI.resolveIssue(issueId);

      if (response.success) {
        toast.success("Issue resolved successfully!");
        await fetchIssues();
      } else {
        toast.error(response.message || "Failed to resolve issue");
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
      toast.error(error.message || "Failed to resolve issue");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (issueId) => {
    try {
      setActionInProgress(issueId);
      const response = await problemAPI.rejectIssue(issueId);

      if (response.success) {
        toast.success("Issue rejected successfully!");
        await fetchIssues();
      } else {
        toast.error(response.message || "Failed to reject issue");
      }
    } catch (error) {
      console.error("Error rejecting issue:", error);
      toast.error(error.message || "Failed to reject issue");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleViewDetails = (issue) => {
    // You can implement a modal or navigate to details page
    toast.info(`Issue: ${issue.title}\nDescription: ${issue.description || 'No description'}`);
  };

  // Debounced search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
      <div className="w-full p-10 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073B1] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (issues.length === 0 && !searchTerm) {
    return (
      <div className="w-full p-10 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Issues Found</h3>
          <p className="text-gray-500">There are no problem reports at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-10 bg-white min-h-screen">

      {/* Header & Search Bar */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Problem Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and resolve reported issues
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Total: {totalIssues}
            </span>
          </p>
        </div>

        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search by title, ID or user..."
              className="outline-none text-sm w-64 text-gray-600"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-hidden rounded-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0073B1] text-white">
              <th className="px-6 py-3 font-medium text-sm">Issue Title</th>
              <th className="px-6 py-3 font-medium text-sm">Shipment ID</th>
              <th className="px-6 py-3 font-medium text-sm">Reported By</th>
              <th className="px-6 py-3 font-medium text-sm text-center">User Type</th>
              <th className="px-6 py-3 font-medium text-sm">Reported Date</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Status</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {issue.title || issue.issue_title || "N/A"}
                    {issue.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                        {issue.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {issue.shipment_id?._id?.slice(-8).toUpperCase() || issue.shipment_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {issue.reported_by?.name || issue.user_id?.name || issue.user_name || "N/A"}
                    <p className="text-xs text-gray-400">{issue.reported_by?.email || issue.user_email || ""}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full ${getUserTypeColor(issue.user_type)} text-white text-xs`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                      {issue.user_type || "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(issue.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(issue.status)} text-white text-xs`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                      {issue.status || "PENDING"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => handleAccept(issue._id)}
                        disabled={actionInProgress === issue._id || issue.status === 'resolved'}
                        className={`text-green-500 hover:scale-110 transition-transform ${(actionInProgress === issue._id || issue.status === 'resolved') ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Resolve Issue"
                      >
                        {actionInProgress === issue._id ? (
                          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(issue._id)}
                        disabled={actionInProgress === issue._id || issue.status === 'rejected'}
                        className={`text-red-400 hover:scale-110 transition-transform ${(actionInProgress === issue._id || issue.status === 'rejected') ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Reject Issue"
                      >
                        <X className="w-5 h-5 border border-red-200 rounded-full p-0.5" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(issue)}
                        className="text-purple-400 hover:scale-110 transition-transform"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? "No issues found matching your search." : "No issues found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-8 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 border border-blue-400 rounded-full text-blue-500 hover:bg-blue-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
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
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === pageNum
                  ? 'bg-[#0073B1] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-400 tracking-widest">.....</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-sm"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 border border-blue-400 rounded-full text-blue-500 hover:bg-blue-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Show total count */}
      {issues.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalIssues)} of {totalIssues} issues
        </div>
      )}
    </div>
  );
};

export default ProblemManagementTable;