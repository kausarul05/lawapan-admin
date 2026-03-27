'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/solid'; // For the close icon

// Mock data for Restaurant Management (re-using from the main component for consistency)
const getAllRestaurants = () => {
    return [
        {
            id: 'R001',
            restaurantName: 'Urban Palate',
            avatar: '/image/Restaurant-img.jpg', // Placeholder avatar
            email: 'urban.palate@example.com',
            phone: '(319) 555-0115',
            registrationDate: '12 Jun 2025',
            days: 'Mon-Sun',
            hours: '8:00 PM - 1:00 AM',
            description: 'A modern restaurant specializing in fusion cuisine.',
        },
        {
            id: 'R002',
            restaurantName: 'The Spicy Spoon',
            avatar: '/image/Restaurant-img.jpg',
            email: 'spicy.spoon@example.com',
            phone: '(319) 555-0116',
            registrationDate: 'February 20, 2024',
            days: 'Tue-Sat',
            hours: '12:00 PM - 10:00 PM',
            description: 'Known for its authentic Indian dishes.',
        },
        {
            id: 'R003',
            restaurantName: 'Green Garden Bistro',
            avatar: '/image/Restaurant-img.jpg',
            email: 'green.garden@example.com',
            phone: '(319) 555-0117',
            registrationDate: 'April 1, 2024',
            days: 'Mon-Fri',
            hours: '9:00 AM - 5:00 PM',
            description: 'Organic and healthy food options.',
        },
        {
            id: 'R004',
            restaurantName: 'Pizza Paradise',
            avatar: '/image/Restaurant-img.jpg',
            email: 'pizza.paradise@example.com',
            phone: '(319) 555-0118',
            registrationDate: 'January 10, 2024',
            days: 'Everyday',
            hours: '11:00 AM - 11:00 PM',
            description: 'Classic and gourmet pizzas.',
        },
        {
            id: 'R005',
            restaurantName: 'Sushi Delights',
            avatar: '/image/Restaurant-img.jpg',
            email: 'sushi.delights@example.com',
            phone: '(319) 555-0119',
            registrationDate: 'May 5, 2024',
            days: 'Wed-Sun',
            hours: '5:00 PM - 10:00 PM',
            description: 'Fresh and traditional Japanese sushi.',
        },
    ];
};

const getRestaurantById = (id) => {
    return getAllRestaurants().find(restaurant => restaurant.id === id);
};


const RestaurantDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = params; // params is already unwrapped in modern Next.js versions
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchedRestaurant = getRestaurantById(id);
            setRestaurant(fetchedRestaurant);
        }
    }, [id]);

    if (!restaurant) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
                Loading restaurant details or restaurant not found...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-opacity-50  p-4 sm:p-6 lg:p-8 z-50 ">
            <div className="relative bg-white text-black rounded-lg shadow-xl w-full max-w-2xl  ">
                {/* Close Button */}
                <button
          onClick={() => router.back()}
          className="absolute -top-3 -right-3 w-10 h-10 bg-[#B92921] text-[#FFF] rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-[#FFF] "
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

                <div className="flex flex-col sm:flex-row p-4">
                    {/* Image Section */}
                    <div className="sm:w-1/2 ">
                        <Image
                            src={restaurant.avatar}
                            alt={restaurant.restaurantName}
                            width={500} // Adjust width as needed
                            height={100} // Adjust height as needed
                            layout="" // Makes image responsive
                            className="w-full h-auto "
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/000000?text=No+Image'; }}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex-grow">
                        <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
                        <div className="space-y-2 text-sm">
                            <p><strong>Restaurant Name:</strong> {restaurant.restaurantName}</p>
                            <p><strong>Email:</strong> {restaurant.email}</p>
                            <p><strong>Phone number:</strong> {restaurant.phone}</p>
                            <p><strong>Registered Date:</strong> {restaurant.registrationDate}</p>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008Z" />
                                </svg>
                                <span>{restaurant.days}</span>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span>{restaurant.hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetailsPage;