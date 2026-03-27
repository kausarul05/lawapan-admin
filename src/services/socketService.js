// services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return;
    }

    // Close existing connection if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    try {
      this.socket = io('https://logistics-shipment-management-backend.onrender.com', {
        transports: ['websocket', 'polling'],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection_status', { status: 'connected', socketId: this.socket.id });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
        this.emit('connection_status', { status: 'disconnected', reason });
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        this.reconnectAttempts++;
        this.emit('connection_error', { error: error.message, attempts: this.reconnectAttempts });
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts`);
      });

      // Real-time event listeners
      this.socket.on('shipment_bidding_started', (data) => {
        console.log('Bidding started:', data);
        this.emit('bidding_started', data);
      });

      this.socket.on('new_bid', (data) => {
        console.log('New bid received:', data);
        this.emit('new_bid', data);
      });

      this.socket.on('bid_accepted', (data) => {
        console.log('Bid accepted:', data);
        this.emit('bid_accepted', data);
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
      this.emit('connection_error', { error: error.message });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinShipmentRoom(shipmentId) {
    if (this.socket && this.isConnected && shipmentId) {
      console.log(`Joining room: shipment_${shipmentId}`);
      this.socket.emit('join_shipment_room', shipmentId);
    } else {
      console.log('Cannot join room - socket not connected or no shipment ID');
    }
  }

  leaveShipmentRoom(shipmentId) {
    if (this.socket && this.isConnected && shipmentId) {
      console.log(`Leaving room: shipment_${shipmentId}`);
      this.socket.emit('leave_shipment_room', shipmentId);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  isConnectedToSocket() {
    return this.isConnected;
  }
}

export default new SocketService();