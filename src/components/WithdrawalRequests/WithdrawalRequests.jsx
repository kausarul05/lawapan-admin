// src/components/WithdrawalRequests.jsx
"use client";

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

// Sample data
const getAllWithdrawalRequests = () => {
  return [
    {
      id: 'WR001',
      userId: 'U001', // User's unique ID
      submittedBy: 'Haus & Herz',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      accountType: 'User',
      dateSubmitted: 'May 7, 2025',
      amount: '€150.00',
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
    },
    {
      id: 'WR002',
      userId: 'U002', // User's unique ID
      submittedBy: 'Studio Pixel',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      accountType: 'Rider',
      dateSubmitted: 'May 6, 2025',
      amount: '€500.00',
      paymentMethod: 'PayPal',
      status: 'Approved',
    },
    {
      id: 'WR003',
      userId: 'U003',
      submittedBy: 'Tech Solutions',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
      accountType: 'User',
      dateSubmitted: 'May 5, 2025',
      amount: '€300.00',
      paymentMethod: 'Bank Transfer',
      status: 'Rejected',
    },
  ];
};

// Function to check if a user can withdraw
const canUserWithdraw = (userId, withdrawalRequests) => {
  // Check if user has any pending withdrawal requests
  const hasPendingRequest = withdrawalRequests.some(
    request => request.userId === userId && request.status === 'Pending'
  );
  
  return !hasPendingRequest;
};

// Function to get user's pending request
const getUserPendingRequest = (userId, withdrawalRequests) => {
  return withdrawalRequests.find(
    request => request.userId === userId && request.status === 'Pending'
  );
};

const WithdrawalRequests = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const itemsPerPage = 10;

  const fetchedData = useMemo(() => getAllWithdrawalRequests(), []);
  
  const filteredData = useMemo(() => {
    return fetchedData.filter(item => 
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, fetchedData]);

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handler for approve button
  const handleApprove = (request) => {
    // Update status to Approved
    console.log(`Approving withdrawal request ${request.id} for user ${request.userId}`);
    alert(`Withdrawal request ${request.id} has been approved!`);
    // In real app: API call to approve
  };

  // Handler for reject button
  const handleReject = (request) => {
    // Update status to Rejected
    console.log(`Rejecting withdrawal request ${request.id} for user ${request.userId}`);
    alert(`Withdrawal request ${request.id} has been rejected!`);
    // In real app: API call to reject
  };

  // Example: Check if a specific user can make a new withdrawal
  const checkWithdrawalEligibility = (userId) => {
    const canWithdraw = canUserWithdraw(userId, fetchedData);
    
    if (!canWithdraw) {
      const pendingRequest = getUserPendingRequest(userId, fetchedData);
      setValidationMessage(
        `User ${userId} already has a pending withdrawal request (${pendingRequest.id}). ` +
        `Only one withdrawal request per user ID is allowed at a time.`
      );
      setShowValidationModal(true);
      return false;
    }
    
    return true;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm font-sans min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Withdrawal Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Only one pending withdrawal per user ID is allowed</p>
        </div>
        
        <div className="flex items-center w-full md:w-auto">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 w-full text-black md:w-64 text-sm rounded-l-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">Withdrawal Policy</p>
            <p className="text-xs text-blue-700 mt-1">
              Each user can only have ONE pending withdrawal request at a time. 
              Once a request is approved or rejected, the user can submit a new withdrawal request.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#036BB4] text-white">
              <th className="py-3.5 px-4 text-sm font-semibold first:rounded-tl-lg">Submitted By</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">User ID</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Account Type</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Date Submitted</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Amount</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Payment Method</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center">Status</th>
              <th className="py-3.5 px-4 text-sm font-semibold text-center last:rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedData.length > 0 ? (
              displayedData.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9">
                        <img 
                          src={req.avatar} 
                          className="rounded-full object-cover w-full h-full border border-gray-200" 
                          alt={req.submittedBy} 
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{req.submittedBy}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono font-semibold">
                      {req.userId}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">{req.accountType}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-500">{req.dateSubmitted}</td>
                  <td className="py-4 px-4 text-center text-sm font-bold text-gray-900">{req.amount}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">{req.paymentMethod}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.status === 'Pending' ? 'bg-orange-50 text-orange-500' : 
                      req.status === 'Approved' ? 'bg-green-50 text-green-500' : 
                      'bg-red-50 text-red-500'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(req)}
                            className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Approve"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(req)}
                            className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => router.push(`/admin/withdrawal-requests/${req.id}`)}
                        className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-10 text-center text-gray-400 text-sm">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XMarkIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Withdrawal Not Allowed</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">{validationMessage}</p>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full bg-[#036BB4] text-white py-3 rounded-lg font-semibold hover:bg-[#025191] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Test Button (Remove in production) */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">Test Validation:</p>
        <div className="flex gap-2">
          <button
            onClick={() => checkWithdrawalEligibility('U001')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Check U001 (Has Pending)
          </button>
          <button
            onClick={() => checkWithdrawalEligibility('U002')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
          >
            Check U002 (Can Withdraw)
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequests;