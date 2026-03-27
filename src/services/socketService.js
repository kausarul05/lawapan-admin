// services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectTimer = null;
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

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    try {
      console.log('Attempting to connect to socket server...');
      console.log('Token available:', token ? 'Yes' : 'No');
      
      // Clean token - remove any whitespace
      const cleanToken = token ? token.trim() : '';
      
      // Try different connection options
      this.socket = io('https://logistics-shipment-management-backend.onrender.com', {
        path: '/socket.io',
        transports: ['polling', 'websocket'],
        auth: {
          token: cleanToken  // Send token directly without Bearer prefix
        },
        query: {
          token: cleanToken  // Also try sending as query parameter
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 30000,
        withCredentials: true
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully! Socket ID:', this.socket.id);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection_status', { 
          status: 'connected', 
          socketId: this.socket.id 
        });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        this.isConnected = false;
        this.emit('connection_status', { 
          status: 'disconnected', 
          reason 
        });
        
        // Attempt to reconnect after 5 seconds if not already reconnecting
        if (reason !== 'io client disconnect' && !this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.reconnectTimer = null;
            if (cleanToken) {
              this.connect(cleanToken);
            }
          }, 5000);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        this.reconnectAttempts++;
        
        // Don't emit error for authentication issues - just log them
        if (error.message.includes('Authentication')) {
          console.log('Authentication error - this is expected if socket server doesn\'t support auth');
          // Don't show toast for authentication errors
        } else {
          this.emit('connection_error', { 
            error: error.message, 
            attempts: this.reconnectAttempts 
          });
        }
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('Max reconnection attempts reached. Socket will not retry.');
          this.emit('connection_status', { 
            status: 'disabled', 
            error: 'Socket connection not available' 
          });
          this.isConnected = false;
        }
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}`);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        this.isConnected = true;
        this.emit('connection_status', { status: 'connected' });
      });

      // Real-time event listeners
      this.socket.on('shipment_bidding_started', (data) => {
        console.log('📢 Bidding started:', data);
        this.emit('bidding_started', data);
      });

      this.socket.on('new_bid', (data) => {
        console.log('🎯 New bid received:', data);
        this.emit('new_bid', data);
      });

      this.socket.on('bid_accepted', (data) => {
        console.log('✅ Bid accepted:', data);
        this.emit('bid_accepted', data);
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
      this.isConnected = false;
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      console.log('Manually disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinShipmentRoom(shipmentId) {
    if (this.socket && this.isConnected && shipmentId) {
      console.log(`🚪 Joining room: shipment_${shipmentId}`);
      this.socket.emit('join_shipment_room', shipmentId);
    } else {
      console.log('Cannot join room - socket not connected');
    }
  }

  leaveShipmentRoom(shipmentId) {
    if (this.socket && this.isConnected && shipmentId) {
      console.log(`🚪 Leaving room: shipment_${shipmentId}`);
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