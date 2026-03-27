// app/vendor/earnings/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';

// Import your dummy data (assuming you have a centralized data source)
// For demonstration, I'll copy the relevant dummy data structure here.
// In a real application, you'd import 'mockOrders' or 'dummyWeeklyData' directly.
const allTransactions = [
    ...Array.from({ length: 90 }).map((_, i) => ({
        serial: `INV093${i}`,
        userName: "Nothing Studio",
        userType: "Service provider",
        subscriptionType: "Annual Fee",
        amount: 50,
        accNumber: `4548465446`,
        date: `Aug. 15, 2023 02:29 PM`,
        fullName: "Jane Cooper",
        email: "abc@example.com",
        phone: "(319) 555-0115",
        transactionID: `TXN${100000 + i}`,
        accHolderName: "Wade Warren",
        receivedAmount: 50,
        detectPercentage: 10,
        finalAmount: 45,
        userImagePath: "/image/user-photo.png",
    })),
    ...Array.from({ length: 75 }).map((_, i) => ({
        serial: `INV094${i}`,
        userName: "Design Co.",
        userType: "Agency",
        subscriptionType: "Monthly Subscription",
        amount: 150,
        accNumber: `987654321${i % 10}`,
        date: `Sep. 01, 2023 10:00 AM`,
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        transactionID: `TXN${200000 + i}`,
        accHolderName: "Alice Smith",
        receivedAmount: 150,
        detectPercentage: 15,
        finalAmount: 127.5,
        userImagePath: "/image/user-photo.png",
    })),
];


const TransactionDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = params; // Get the transaction ID from the URL
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        if (id) {
            // In a real application, you would fetch this from an API
            // For now, we'll find it in our combined dummy data
            const foundTransaction = allTransactions.find(t => t.transactionID === id);
            setTransaction(foundTransaction);
        }
    }, [id]);

    const handleClose = () => {
        router.back(); // Go back to the previous page (EarningsTable)
    };

    if (!transaction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
                <p>Loading transaction details or transaction not found...</p>
            </div>
        );
    }

    // Determine the user image to display
    const userImage = transaction.userImagePath || "/image/default-user.png"; // Fallback if userImagePath is missing

    return (
        <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
            <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md w-full sm:p-8">
                {/* Close Button (Red Circle with White X) */}
                <button
                    onClick={handleClose}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-[#036BB4] rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
                >
                    <X className="text-white" size={24} strokeWidth={2} />
                </button>

                <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6 mb-6">
                    {/* User Image */}
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                        <Image
                            src={userImage}
                            alt="User"
                            width={100}
                            height={100}
                            className="rounded-full object-cover border border-gray-200"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/image/default-user.png"; }} // Fallback image if userImagePath fails
                            unoptimized // Add unoptimized if image optimization causes issues with external URLs
                        />
                    </div>

                    {/* User Details */}
                    <div className="text-center sm:text-left">
                        <p className="text-gray-800 text-lg font-semibold mb-1">Full name : {transaction.fullName}</p>
                        <p className="text-gray-600 text-sm mb-1">Email: {transaction.email}</p>
                        <p className="text-gray-600 text-sm">Phone number: {transaction.phone}</p>
                    </div>
                </div>

                <h3 className="text-gray-800 text-xl font-bold mb-4 border-b pb-2 border-gray-200">Transaction Details :</h3>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p className="text-gray-600 font-medium">Transaction ID :</p>
                    <p className="text-right text-gray-800 font-semibold">{transaction.transactionID}</p>

                    <p className="text-gray-600 font-medium">A/C holder name:</p>
                    <p className="text-right text-gray-800">{transaction.accHolderName}</p>

                    <p className="text-gray-600 font-medium">A/C number:</p>
                    <p className="text-right text-gray-800">
                        {/* Mask account number */}
                        {transaction.accNumber ? `**** **** *${transaction.accNumber.slice(-3)}` : 'N/A'}
                    </p>

                    <p className="text-gray-600 font-medium">Received amount:</p>
                    <p className="text-right text-gray-800">${transaction.receivedAmount.toFixed(2)}</p>

                    <p className="text-gray-600 font-medium">Detect Percentage:</p>
                    <p className="text-right text-gray-800">
                        {/* Assuming detectPercentage is a number representing a dollar amount here */}
                        ${transaction.detectPercentage.toFixed(2)}
                    </p>

                    <p className="text-gray-800 font-semibold text-base">Final Amount:</p>
                    <p className="text-right text-gray-800 font-semibold text-base">${transaction.finalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsPage;