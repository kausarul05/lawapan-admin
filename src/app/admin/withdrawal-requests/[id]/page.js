// app/admin/withdrawal-requests/[id]/page.jsx
"use client";

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

// Mock function to get withdrawal request by ID
const getWithdrawalRequestById = (id) => {
  const requests = {
    'WR001': {
      id: 'WR001',
      userId: 'U001',
      fullName: "Jane Cooper",
      email: "jane.cooper@example.com",
      phone: "(319) 555-0115",
      transactionId: "12345678",
      accountHolder: "Wade Warren",
      accountNumber: "**** **** *456",
      bankName: "Bank of America",
      received: "$500",
      detect: "$100",
      final: "$400",
      status: 'Pending',
      submittedBy: 'Haus & Herz',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      accountType: 'User',
      dateSubmitted: 'May 7, 2025',
      paymentMethod: 'Bank Transfer',
    },
    'WR002': {
      id: 'WR002',
      userId: 'U002',
      fullName: "Robert Fox",
      email: "robert.fox@example.com",
      phone: "(219) 555-0114",
      transactionId: "87654321",
      accountHolder: "Robert Fox",
      accountNumber: "**** **** *789",
      bankName: "Chase Bank",
      received: "$500",
      detect: "$0",
      final: "$500",
      status: 'Approved',
      submittedBy: 'Studio Pixel',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      accountType: 'Rider',
      dateSubmitted: 'May 6, 2025',
      paymentMethod: 'PayPal',
    },
    'WR003': {
      id: 'WR003',
      userId: 'U003',
      fullName: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(419) 555-0116",
      transactionId: "45678912",
      accountHolder: "Sarah Johnson",
      accountNumber: "**** **** *123",
      bankName: "Wells Fargo",
      received: "$300",
      detect: "$50",
      final: "$250",
      status: 'Rejected',
      submittedBy: 'Tech Solutions',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
      accountType: 'User',
      dateSubmitted: 'May 5, 2025',
      paymentMethod: 'Bank Transfer',
    },
  };
  return requests[id] || null;
};

export default function WithdrawalDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [isProcessing, setIsProcessing] = useState(false);

  const data = getWithdrawalRequestById(id);

  if (!data) {
    return (
      <div className="p-8 bg-white min-h-screen font-sans text-gray-900">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 bg-blue-50 rounded-full text-[#036BB4] hover:bg-blue-100 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Withdrawal Request Not Found</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">The withdrawal request with ID "{id}" was not found.</p>
        </div>
      </div>
    );
  }

  const handleAction = (type) => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      if (actionType === 'approve') {
        console.log(`Approving withdrawal request ${data.id} for user ${data.userId}`);
        alert(`Withdrawal request ${data.id} has been approved!\nAmount ${data.final} will be transferred to ${data.accountHolder}.`);
      } else {
        console.log(`Rejecting withdrawal request ${data.id} for user ${data.userId}`);
        alert(`Withdrawal request ${data.id} has been rejected.`);
      }
      
      setIsProcessing(false);
      setShowConfirmModal(false);
      router.back();
    }, 1500);
  };

  return (
    <div className="p-8 bg-white min-h-screen font-sans text-gray-900">
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-blue-50 rounded-full text-[#036BB4] hover:bg-blue-100 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Withdrawal Request Details</h1>
      </div>

      <div className="max-w-4xl">
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`text-white text-xs px-3 py-1 rounded-full font-bold flex items-center w-fit gap-2 ${
            data.status === 'Pending' ? 'bg-orange-500' :
            data.status === 'Approved' ? 'bg-green-500' :
            'bg-red-500'
          }`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full" /> {data.status}
          </span>
        </div>

        {/* User Info Card */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
          <img 
            src={data.avatar} 
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
            alt={data.submittedBy} 
          />
          <div>
            <p className="text-sm text-gray-500">Submitted by</p>
            <p className="text-lg font-bold text-gray-900">{data.submittedBy}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold">
                {data.accountType}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
                ID: {data.userId}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">Basic Information</h2>
        
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Full Name</p>
              <p className="font-bold">{data.fullName}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-medium">Email Address</p>
              <p className="font-bold">{data.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Phone</p>
              <p className="font-bold">{data.phone}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-medium">Transaction ID</p>
              <p className="font-bold">{data.transactionId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Account Holder Name</p>
              <p className="font-bold">{data.accountHolder}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-medium">Account Number</p>
              <p className="font-bold">{data.accountNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Bank Name</p>
              <p className="font-bold">{data.bankName}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-medium">Payment Method</p>
              <p className="font-bold">{data.paymentMethod}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 bg-gray-50">
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Received Amount</p>
              <p className="font-bold text-lg">{data.received}</p>
            </div>
            <div className="p-5 border-r border-gray-100">
              <p className="text-gray-400 text-xs font-medium">Deduct Percentage</p>
              <p className="font-bold text-lg text-red-500">{data.detect}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-medium">Final Amount</p>
              <p className="font-bold text-lg text-green-600">{data.final}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show if status is Pending */}
        {data.status === 'Pending' && (
          <div className="flex gap-4">
            <button 
              onClick={() => handleAction('approve')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <CheckIcon className="w-5 h-5" /> Accept
            </button>
            <button 
              onClick={() => handleAction('reject')}
              className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <XMarkIcon className="w-5 h-5" /> Reject
            </button>
          </div>
        )}

        {/* Status Message for Approved/Rejected */}
        {data.status === 'Approved' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Request Approved</p>
                <p className="text-sm text-green-700">This withdrawal request has been approved on {data.dateSubmitted}</p>
              </div>
            </div>
          </div>
        )}

        {data.status === 'Rejected' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <XMarkIcon className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Request Rejected</p>
                <p className="text-sm text-red-700">This withdrawal request has been rejected on {data.dateSubmitted}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {actionType === 'approve' ? (
                  <CheckIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <XMarkIcon className="w-6 h-6 text-red-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to {actionType} this withdrawal request?
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-xs text-gray-500">Request ID</p>
              <p className="font-bold text-gray-900">{data.id}</p>
              <p className="text-xs text-gray-500 mt-2">User ID</p>
              <p className="font-bold text-gray-900">{data.userId}</p>
              <p className="text-xs text-gray-500 mt-2">Amount</p>
              <p className="font-bold text-green-600 text-lg">{data.final}</p>
            </div>

            {actionType === 'approve' && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  ⚠️ Once approved, the amount will be transferred to the user's account.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={isProcessing}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                  actionType === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : `Yes, ${actionType === 'approve' ? 'Approve' : 'Reject'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}