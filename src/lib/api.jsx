// src/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Get token from cookies if it exists (using document.cookie for client-side)
  const token = getCookie('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper function to get cookie value (client-side only)
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to set cookie (client-side only)
export const setCookie = (name, value, days = 30) => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Helper function to remove cookie (client-side only)
export const removeCookie = (name) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Auth API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiRequest('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      removeCookie('token');
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// User API calls
export const userAPI = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Create user
  createUser: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Admin API calls
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get all admin users
  getAdminUsers: async () => {
    return apiRequest('/admin/users');
  },

  // Create admin user
  createAdmin: async (adminData) => {
    return apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  // Update admin user
  updateAdmin: async (adminId, adminData) => {
    return apiRequest(`/admin/users/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  },

  // Delete admin user
  deleteAdmin: async (adminId) => {
    return apiRequest(`/admin/users/${adminId}`, {
      method: 'DELETE',
    });
  },
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  admin: adminAPI,
  setCookie,
  removeCookie,
  getCookie,
};