'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid'; // For the view icon
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Mock data for Restaurant Management
const getAllRestaurants = () => {
    return [
        {
            id: 'R001',
            restaurantName: 'Urban Palate',
            avatar: '/image/userImage.png', // Placeholder avatar
            email: 'urban.palate@example.com',
            phone: '01797000000',
            registrationDate: 'March 15, 2024',
            description: 'A modern restaurant specializing in fusion cuisine.',
        },
        {
            id: 'R002',
            restaurantName: 'The Spicy Spoon',
            avatar: '/image/userImage.png',
            email: 'spicy.spoon@example.com',
            phone: '01797000001',
            registrationDate: 'February 20, 2024',
            description: 'Known for its authentic Indian dishes.',
        },
        {
            id: 'R003',
            restaurantName: 'Green Garden Bistro',
            avatar: '/image/userImage.png',
            email: 'green.garden@example.com',
            phone: '01797000002',
            registrationDate: 'April 1, 2024',
            description: 'Organic and healthy food options.',
        },
        {
            id: 'R004',
            restaurantName: 'Pizza Paradise',
            avatar: '/image/userImage.png',
            email: 'pizza.paradise@example.com',
            phone: '01797000003',
            registrationDate: 'January 10, 2024',
            description: 'Classic and gourmet pizzas.',
        },
        {
            id: 'R005',
            restaurantName: 'Sushi Delights',
            avatar: '/image/userImage.png',
            email: 'sushi.delights@example.com',
            phone: '01797000004',
            registrationDate: 'May 5, 2024',
            description: 'Fresh and traditional Japanese sushi.',
        },
        {
            id: 'R006',
            restaurantName: 'Burger Joint',
            avatar: '/image/userImage.png',
            email: 'burger.joint@example.com',
            phone: '01797000005',
            registrationDate: 'March 22, 2024',
            description: 'American style burgers and fries.',
        },
        {
            id: 'R007',
            restaurantName: 'Cafe Mocha',
            avatar: '/image/userImage.png',
            email: 'cafe.mocha@example.com',
            phone: '01797000006',
            registrationDate: 'April 15, 2024',
            description: 'Cozy cafe with a variety of coffees and pastries.',
        },
        {
            id: 'R008',
            restaurantName: 'Pasta Palace',
            avatar: '/image/userImage.png',
            email: 'pasta.palace@example.com',
            phone: '01797000007',
            registrationDate: 'February 1, 2024',
            description: 'Authentic Italian pasta dishes.',
        },
        {
            id: 'R009',
            restaurantName: 'The Wok Spot',
            avatar: '/image/userImage.png',
            email: 'wok.spot@example.com',
            phone: '01797000008',
            registrationDate: 'January 25, 2024',
            description: 'Fast and fresh stir-fries.',
        },
        {
            id: 'R010',
            restaurantName: 'Sweet Treats Bakery',
            avatar: '/image/userImage.png',
            email: 'sweet.treats@example.com',
            phone: '01797000009',
            registrationDate: 'May 1, 2024',
            description: 'Delicious cakes, cookies, and desserts.',
        },
        {
            id: 'R011',
            restaurantName: 'Grill House',
            avatar: '/image/userImage.png',
            email: 'grill.house@example.com',
            phone: '01797000010',
            registrationDate: 'March 1, 2024',
            description: 'Premium grilled meats and sides.',
        },
    ];
};

const ITEMS_PER_PAGE = 10; // Number of rows per page
const PAGE_RANGE = 2; // Number of pages to show around the current page

const RestaurantManagement = () => {
    const router = useRouter(); // Initialize useRouter
    const [currentPage, setCurrentPage] = useState(1);
    const [allRestaurants, setAllRestaurants] = useState([]); // Store all restaurants, filtered by search
    const [displayedRestaurants, setDisplayedRestaurants] = useState([]); // Store restaurants for current page
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger data re-fetch

    // Fetch all restaurants and filter them based on search term
    useEffect(() => {
        const fetchedRestaurants = getAllRestaurants(); // Get all restaurants from mock data
        const filtered = fetchedRestaurants.filter(restaurant =>
            restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAllRestaurants(filtered);
        setCurrentPage(1); // Reset to first page on search or full data refresh
    }, [searchTerm, refreshTrigger]); // Re-run when search term changes or data needs refresh

    // Update displayed restaurants based on current page and filtered 'allRestaurants'
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedRestaurants(allRestaurants.slice(startIndex, endIndex));
    }, [currentPage, allRestaurants]); // Re-run when current page or filtered restaurants change


    // Calculate total pages based on currently filtered restaurants (allRestaurants)
    const totalPages = Math.ceil(allRestaurants.length / ITEMS_PER_PAGE);

    // Calculate page numbers for pagination (with ellipsis)
    const pageNumbers = useMemo(() => {
        if (totalPages <= 1) return [1];
        const pages = [];
        let start = Math.max(1, currentPage - PAGE_RANGE);
        let end = Math.min(totalPages, currentPage + PAGE_RANGE);
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    }, [currentPage, totalPages]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openDetailsPage = (restaurantId) => {
        router.push(`/admin/restaurant-management/${restaurantId}`); // Navigate to the dynamic details page
    };

    // Handle Delete Restaurant (Red X)
    const handleDeleteRestaurant = useCallback((restaurantId) => {
        // In a real app: call API to delete the restaurant
        console.log(`Restaurant ${restaurantId} deleted.`);
        // For demonstration, just log and refresh.
        // deleteRestaurant(restaurantId); // if you had a function to modify mock data
        setRefreshTrigger(prev => prev + 1); // Trigger re-fetch to reflect changes
    }, []);

    return (
        <>
            <div className="bg-white text-black p-6 sm:p-6 lg:p-8 rounded shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[20px] sm:text-3xl font-semibold">Restaurant Management</h1>
                    <div className="flex items-center">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search restaurant"
                                className="pl-10 pr-4 py-2 bg-gray-100 rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="hover:bg-gray-200 transition-colors bg-[#B92921] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px] border-[1px] border-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <path
                                    d="M11 8.5L20 8.5"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M4 16.5L14 16.5"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <ellipse
                                    cx="7"
                                    cy="8.5"
                                    rx="3"
                                    ry="3"
                                    transform="rotate(90 7 8.5)"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <ellipse
                                    cx="17"
                                    cy="16.5"
                                    rx="3"
                                    ry="3"
                                    transform="rotate(90 17 16.5)"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="border-b border-gray-300 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-red-600"> 
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Restaurant ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Restaurant Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Registration Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {displayedRestaurants.length > 0 ? (
                                displayedRestaurants.map((restaurant) => (
                                    <tr key={restaurant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                            {restaurant.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-gray-300">
                                                    <Image
                                                        src={restaurant.avatar}
                                                        alt="Restaurant Avatar"
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/32x32/CCCCCC/000000?text=NA'; }}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-black">{restaurant.restaurantName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                            {restaurant.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                            {restaurant.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                            {restaurant.registrationDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                                                    className="text-red-600 hover:text-white cursor-pointer p-2 rounded-full border border-red-600 bg-red-100 hover:bg-red-600 transition-colors duration-200"
                                                    aria-label="Delete restaurant"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDetailsPage(restaurant.id)}
                                                    className="text-purple-600 cursor-pointer border border-purple-600 bg-purple-100 hover:text-white hover:bg-purple-600 p-2 rounded-full transition-colors duration-200"
                                                    aria-label="View details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No restaurants found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-8 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-white border border-gray-300 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-4 py-2 text-black">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded ${
                                    currentPage === page ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-100'
                                } border border-gray-300 transition-colors duration-200`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-white border border-gray-300 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};

export default RestaurantManagement;
