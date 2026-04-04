// components/LiveBidsTransporter.jsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  MinusCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bidAPI } from '@/lib/api';
import socketService from '@/services/socketService';


// Replace localhost URL with server URL
    const replaceImageUrl = (url) => {
        if (!url) return '/shipment-sample.jpg';
        // Replace localhost:5000 with server.lawapantruck.com
        return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
    };

const LiveBidsTransporter = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shipmentIndex, setShipmentIndex] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectingSocket, setConnectingSocket] = useState(false);
  const itemsPerPage = 5;

  // Fetch all shipments (bidding shipments)
  useEffect(() => {
    fetchShipments();
    initializeSocket();

    return () => {
      if (selectedShipment) {
        socketService.leaveShipmentRoom(selectedShipment._id);
      }
      // Don't disconnect socket on unmount to keep connection for other components
    };
  }, []);

  // Join room and fetch bids when selected shipment changes
  useEffect(() => {
    if (selectedShipment) {
      if (socketConnected) {
        socketService.joinShipmentRoom(selectedShipment._id);
      }
      fetchBidsForShipment(selectedShipment._id);
    }

    return () => {
      if (selectedShipment && socketConnected) {
        socketService.leaveShipmentRoom(selectedShipment._id);
      }
    };
  }, [selectedShipment, socketConnected]);

  // Socket event listeners
  useEffect(() => {
    if (socketConnected) {
      socketService.on('new_bid', handleNewBid);
      socketService.on('bid_accepted', handleBidAccepted);
      socketService.on('connection_status', handleConnectionStatus);

      return () => {
        socketService.off('new_bid', handleNewBid);
        socketService.off('bid_accepted', handleBidAccepted);
        socketService.off('connection_status', handleConnectionStatus);
      };
    }
  }, [socketConnected, selectedShipment]);

  const initializeSocket = async () => {
    try {
      setConnectingSocket(true);
      const token = getCookie('token');

      if (token) {
        console.log('Initializing socket connection with token...');

        // Set up connection status listener BEFORE connecting
        socketService.on('connection_status', (status) => {
          console.log('Socket status update:', status);

          if (status.status === 'connected') {
            setSocketConnected(true);
            toast.success('Real-time bidding connected!', { duration: 3000 });

            // Re-join room if there's a selected shipment
            if (selectedShipment) {
              setTimeout(() => {
                socketService.joinShipmentRoom(selectedShipment._id);
              }, 500);
            }
          } else if (status.status === 'disabled') {
            setSocketConnected(false);
            // Don't show error toast - just note that real-time is disabled
            console.log('Real-time bidding not available');
          } else {
            setSocketConnected(false);
          }
          setConnectingSocket(false);
        });

        socketService.on('connection_error', (error) => {
          console.error('Socket error:', error);
          setConnectingSocket(false);
          setSocketConnected(false);
        });

        // Connect to socket
        socketService.connect(token);

        // Set a timeout to handle connection - don't show errors to users
        setTimeout(() => {
          if (!socketService.isConnectedToSocket() && !socketConnected) {
            console.log('Socket connection timeout - real-time features disabled');
            setConnectingSocket(false);
            setSocketConnected(false);
            // Don't show toast error - just silently disable real-time
          }
        }, 5000);

      } else {
        console.log('No token found for socket connection');
        setConnectingSocket(false);
        setSocketConnected(false);
      }
    } catch (error) {
      console.error('Socket initialization error:', error);
      setConnectingSocket(false);
      setSocketConnected(false);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await bidAPI.getAllBids();

      if (response.success) {
        // Show all bids, no filtering
        const allShipments = response.data || [];
        setShipments(allShipments);
        setTotalPages(Math.ceil(allShipments.length / itemsPerPage));

        // Select first shipment if available
        if (allShipments.length > 0) {
          setSelectedShipment(allShipments[0]);
        }
      } else {
        toast.error(response.message || "Failed to fetch shipments");
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error(error.message || "Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForShipment = async (shipmentId) => {
    try {
      setBidsLoading(true);
      console.log("Fetching bids for shipment:", shipmentId);

      const response = await bidAPI.getBidsByShipment(shipmentId);

      console.log("Bids response:", response);

      if (response.success) {
        const bidsData = response.data || [];
        setBids(bidsData);

        if (bidsData.length === 0) {
          console.log("No bids found for this shipment");
        } else {
          console.log(`${bidsData.length} bids found`);
        }
      } else {
        console.error("Failed to fetch bids:", response.message);
        setBids([]);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      setBids([]);
    } finally {
      setBidsLoading(false);
    }
  };

  const handleRefreshBids = async () => {
    if (selectedShipment) {
      setRefreshing(true);
      await fetchBidsForShipment(selectedShipment._id);
      setRefreshing(false);
      toast.success('Bids refreshed!');
    }
  };

  const handleNewBid = (data) => {
    console.log("New bid received via socket:", data);
    if (data.shipment_id === selectedShipment?._id) {
      toast.success(`New bid received: $${data.bid_amount}`, {
        duration: 4000,
        position: 'top-right'
      });
      // Refresh bids for current shipment
      fetchBidsForShipment(selectedShipment._id);
    } else if (data.shipment_id) {
      // If bid is for a different shipment, show notification
      const shipment = shipments.find(s => s._id === data.shipment_id);
      if (shipment) {
        toast.info(`New bid on "${shipment.shipment_title}"`, {
          duration: 3000,
          position: 'top-right'
        });
      }
    }
  };

  const handleBidAccepted = (data) => {
    console.log("Bid accepted:", data);
    toast.success(`Bid has been accepted!`);
    // Refresh shipments to update status
    fetchShipments();
    if (selectedShipment) {
      fetchBidsForShipment(selectedShipment._id);
    }
  };

  const handleConnectionStatus = (status) => {
    console.log("Connection status update:", status);
    setSocketConnected(status.status === 'connected');
  };

  const handleAcceptBid = async (bid) => {
    try {
      const response = await bidAPI.acceptBid(bid._id);

      if (response.success) {
        toast.success(`Bid accepted from ${bid.transporter_id || 'transporter'}!`);
        // Refresh shipments to update status
        await fetchShipments();
        if (selectedShipment) {
          await fetchBidsForShipment(selectedShipment._id);
        }
      } else {
        toast.error(response.message || "Failed to accept bid");
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast.error(error.message || "Failed to accept bid");
    }
  };

  const handleViewBidDetails = (bid) => {
    // Show bid details in a modal or alert with more info
    const bidDetails = `
      Bid Details:
      ─────────────
      Transporter ID: ${bid.transporter_id || 'N/A'}
      Bid Amount: $${bid.bid_amount || 'N/A'}
      Driver ID: ${bid.driver_id || 'N/A'}
      Vehicle ID: ${bid.vehicle_id || 'N/A'}
      Bid ID: ${bid._id || 'N/A'}
      Created: ${bid.createdAt ? new Date(bid.createdAt).toLocaleString() : 'N/A'}
    `;

    // You can replace this with a proper modal component
    alert(bidDetails);
  };

  const handlePrevShipment = () => {
    if (shipmentIndex > 0) {
      const newIndex = shipmentIndex - 1;
      setShipmentIndex(newIndex);
      setSelectedShipment(shipments[newIndex]);
    }
  };

  const handleNextShipment = () => {
    if (shipmentIndex < shipments.length - 1) {
      const newIndex = shipmentIndex + 1;
      setShipmentIndex(newIndex);
      setSelectedShipment(shipments[newIndex]);
    }
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

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'bg-green-500';
      case 'BIDDING':
        return 'bg-yellow-500';
      case 'ASSIGNED':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-orange-500';
      case 'COMPLETED':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get bidder name from transporter ID
  const getBidderName = (transporterId) => {
    if (!transporterId) return "Unknown";
    return `Transporter ${transporterId.slice(-6).toUpperCase()}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading live bids...</p>
        </div>
      </div>
    );
  }

  // No shipments state
  if (shipments.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Live Bids & Assigned Transporter
            {socketConnected && (
              <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                ● Live
              </span>
            )}
          </h2>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Bidding Shipments</h3>
          <p className="text-gray-500">There are currently no shipments in the bidding phase.</p>
        </div>
      </div>
    );
  }

  // Current visible shipments for slider
  const visibleShipments = shipments.slice(shipmentIndex, shipmentIndex + 5);

  return (
    <div className="p-6 bg-white min-h-screen font-sans">

      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          Live Bids & Assigned Transporter
          {connectingSocket ? (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
              Connecting...
            </span>
          ) : socketConnected ? (
            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              ● Live
            </span>
          ) : (
            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              Offline
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevShipment}
            disabled={shipmentIndex === 0}
            className={`p-1 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors ${shipmentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextShipment}
            disabled={shipmentIndex >= shipments.length - 5}
            className={`p-1 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors ${shipmentIndex >= shipments.length - 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 2. Horizontal Shipment Cards Slider */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {visibleShipments.map((ship) => (
          <div
            key={ship._id}
            onClick={() => setSelectedShipment(ship)}
            className={`relative min-w-[220px] h-[130px] rounded-xl overflow-hidden shadow-md cursor-pointer transition-all ${selectedShipment?._id === ship._id
              ? 'ring-2 ring-[#036BB4] ring-offset-2'
              : 'hover:scale-105'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gray-600">
              {ship.shipment_images?.[0] ? (
                <img
                  src={replaceImageUrl(ship.shipment_images[0])}
                  alt={ship.shipment_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              {/* <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <MinusCircle size={10} /> Remove
              </span> */}
              <span className={`${getStatusColor(ship.status)} text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                {ship.status}
              </span>
            </div>

            {/* Title */}
            <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold truncate">
              {ship.shipment_title}
            </div>
          </div>
        ))}
      </div>

      {selectedShipment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 3. Bids Table Section */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Bids for: {selectedShipment.shipment_title}
                </h3>
                <div className="flex gap-4 mt-1">
                  <p className="text-sm text-gray-500">
                    Shipment Price: {formatCurrency(selectedShipment.price)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Bids: {bids.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefreshBids}
                disabled={refreshing || bidsLoading}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Refresh bids"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              {bidsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#036BB4] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading bids...</p>
                </div>
              ) : bids.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-[#036BB4] text-white text-sm">
                      <th className="py-3 px-6 font-semibold">Bidder</th>
                      <th className="py-3 px-6 font-semibold">Bid Amount</th>
                      <th className="py-3 px-6 font-semibold">Driver/Vehicle</th>
                      <th className="py-3 px-6 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bids.map((bid) => (
                      <tr key={bid._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewBidDetails(bid)}>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">
                                {bid.transporter_id?.slice(-2).toUpperCase() || 'TL'}
                              </span>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {getBidderName(bid.transporter_id)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <span className="text-sm font-bold text-green-600">
                            {formatCurrency(bid.bid_amount)}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <div className="text-xs text-gray-500">
                            <div>Driver: {bid.driver_id?.slice(-6).toUpperCase() || 'N/A'}</div>
                            <div>Vehicle: {bid.vehicle_id?.slice(-6).toUpperCase() || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptBid(bid);
                              }}
                              className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                              title="Accept Bid"
                            >
                              <Check size={16} strokeWidth={3} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewBidDetails(bid);
                              }}
                              className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No bids yet for this shipment</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Bids will appear here once transporters start bidding
                  </p>
                  {socketConnected && (
                    <div className="mt-3 text-xs text-green-500 flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Waiting for incoming bids...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. Assigned Transporter Section */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="mb-6 relative w-48 h-48">
              <div className="w-full h-full flex items-center justify-center text-blue-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32 opacity-80">
                  <path d="M5 2h14v5l-4 4 4 4v5H5v-5l4-4-4-4V2z" />
                  <path d="M9 2v5l3 3 3-3V2M9 22v-5l3-3 3 3v5" />
                  <path d="M8 6h8M8 18h8" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              {bids.length > 0 ? 'Review Bids to Assign Transporter' : 'Waiting for Transporter Bids'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              {bids.length > 0
                ? `${bids.length} transporter${bids.length > 1 ? 's have' : ' has'} placed bid${bids.length > 1 ? 's' : ''}. Click on the bid to view details or accept.`
                : 'We are actively waiting for transporters to place bids on your shipment. Once bids come in, they will appear in real-time.'}
            </p>
            {socketConnected && bids.length === 0 && (
              <div className="mt-4 text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real-time monitoring active
              </div>
            )}
            {bids.length > 0 && (
              <div className="mt-4 text-xs text-blue-500">
                💡 Tip: Click on any bid row to view full details
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Pagination Footer */}
      {shipments.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-2 mt-8">
          <button
            onClick={handlePrevShipment}
            disabled={shipmentIndex === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50 ${shipmentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (Math.floor(shipmentIndex / itemsPerPage) + 1 <= 3) {
              pageNum = i + 1;
            } else if (Math.floor(shipmentIndex / itemsPerPage) + 1 >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = Math.floor(shipmentIndex / itemsPerPage) - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => {
                  const newIndex = (pageNum - 1) * itemsPerPage;
                  setShipmentIndex(newIndex);
                  setSelectedShipment(shipments[newIndex]);
                }}
                className={`w-10 h-10 rounded-md transition-colors ${Math.floor(shipmentIndex / itemsPerPage) + 1 === pageNum
                  ? 'bg-[#036BB4] text-white font-bold text-sm'
                  : 'text-gray-500 hover:bg-gray-100 text-sm'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && Math.floor(shipmentIndex / itemsPerPage) + 1 < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-300">.....</span>
              <button
                onClick={() => {
                  const newIndex = (totalPages - 1) * itemsPerPage;
                  setShipmentIndex(newIndex);
                  setSelectedShipment(shipments[newIndex]);
                }}
                className="w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 text-sm"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={handleNextShipment}
            disabled={shipmentIndex >= shipments.length - 5}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50 ${shipmentIndex >= shipments.length - 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LiveBidsTransporter;