'use client';

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock rider data
const initialRiders = new Array(35).fill(null).map((_, i) => ({
  id: `rider-${i + 1}`,
  riderId: `RDR${1000 + i}`,
  name: `Mason Brooks ${i + 1}`,
  email: `rider${i + 1}@gmail.com`,
  registrationDate: `March ${15 + (i % 15)}, 2024`, // Varying date
  avatar: 'https://placehold.co/24x24/cccccc/000000?text=R', // Avatar for table view
}));

const RiderManagement = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRiders, setCurrentRiders] = useState(initialRiders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Filter riders based on search term
  const filteredRiders = useMemo(() => {
    if (!searchTerm) {
      return currentRiders;
    }
    return currentRiders.filter(rider =>
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.riderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, currentRiders]);

  // Calculate riders for the current page
  const indexOfLastRider = currentPage * itemsPerPage;
  const indexOfFirstRider = indexOfLastRider - itemsPerPage;
  const currentRidersDisplayed = filteredRiders.slice(indexOfFirstRider, indexOfLastRider);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle deleting a rider (placeholder)
  const handleDelete = (riderId) => {
    console.log(`Deleting rider: ${riderId}`);
    // In a real app, you'd show a confirmation modal here
    setCurrentRiders(prevRiders => prevRiders.filter(rider => rider.id !== riderId));
    if (currentPage > Math.ceil((filteredRiders.length - 1) / itemsPerPage)) {
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
  };

  // Handle viewing rider details (placeholder for navigation)
  const handleViewRider = (riderId) => {
    router.push(`/admin/rider-management/${riderId}`); // Example navigation path
  };

  // Function to render page numbers dynamically
  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push('...');
      if (currentPage !== totalPages) pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, index) => (
      num === '...' ? (
        <span key={index} className="px-2 text-gray-500">.....</span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageChange(num)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            currentPage === num ? 'bg-[#B92921] text-white' : 'hover:bg-gray-100 text-black'
          }`}
        >
          {num}
        </button>
      )
    ));
  };

  return (
    <>
      <div className="bg-white rounded-lg text-black p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rider Management</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center ">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>
              <button
                onClick={() => console.log("Filter/Sort button clicked")}
                className="transition-colors bg-[#C12722] p-[7px] rounded-tr-[7.04px] rounded-br-[7.04px] border-[1px] border-gray-300"
              >
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#C12722]">
              <tr className="text-sm text-white">
                <th className="py-3 px-4 text-center">Rider ID</th>
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Registration Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRidersDisplayed.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-600 border-b border-gray-300">
                    No riders found matching your search.
                  </td>
                </tr>
              ) : (
                currentRidersDisplayed.map((rider) => (
                  <tr key={rider.id} className="text-sm text-black border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4 text-center">
                      {rider.riderId}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <img
                          src={rider.avatar}
                          alt="avatar"
                          width={24}
                          height={24}
                          className="rounded-full"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/cccccc/000000?text=R" }}
                        />
                        {rider.name}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {rider.email}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {rider.registrationDate}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Red Cross Icon (Delete/Block) */}
                        <button
                          onClick={() => handleDelete(rider.id)}
                          className="text-red-700 hover:text-red-900 border border-[#FF0000] rounded-[51px] p-[5px] cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 12 11"
                            fill="none"
                          >
                            <path
                              d="M10.6668 0.684326L1.3335 10.0177M1.3335 0.684326L10.6668 10.0177"
                              stroke="#FF0000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {/* Purple Eye Icon (View) */}
                        <button
                          onClick={() => handleViewRider(rider.id)}
                          className="text-purple-700 border border-[#C267FF] hover:text-purple-900 rounded-[51px] p-[5px] cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 11"
                            fill="none"
                          >
                            <path
                              d="M14.3628 4.63424C14.5655 4.91845 14.6668 5.06056 14.6668 5.27091C14.6668 5.48127 14.5655 5.62338 14.3628 5.90759C13.4521 7.18462 11.1263 9.93758 8.00016 9.93758C4.87402 9.93758 2.54823 7.18462 1.63752 5.90759C1.43484 5.62338 1.3335 5.48127 1.3335 5.27091C1.3335 5.06056 1.43484 4.91845 1.63752 4.63424C2.54823 3.35721 4.87402 0.604248 8.00016 0.604248C11.1263 0.604248 13.4521 3.35721 14.3628 4.63424Z"
                              stroke="#C267FF"
                            />
                            <path
                              d="M10 5.271C10 4.16643 9.10457 3.271 8 3.271C6.89543 3.271 6 4.16643 6 5.271C6 6.37557 6.89543 7.271 8 7.271C9.10457 7.271 10 6.37557 10 5.271Z"
                              stroke="#C267FF"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-black">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center border border-[#B92921] rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#B92921" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center border border-[#B92921] rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#B92921" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default RiderManagement;
