// src/lib/api.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  console.log("Making API request to:", url)

  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  // Try to get token from multiple sources
  let token = getCookie('token')

  // If not in cookies, try localStorage
  if (!token && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token')
    console.log("Token from localStorage:", token ? "Found" : "Not found")
  }

  // Also check for user data in localStorage
  if (!token && typeof localStorage !== 'undefined') {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        token = user.token || user.access_token
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }
  }

  // console.log("Token found:", token ? "Yes" : "No")

  if (token) {
    // Try both formats - some backends need "Bearer ", some don't
    // Let's try without "Bearer " first as per your Postman
    defaultHeaders['Authorization'] = token

    // If that doesn't work, uncomment the line below to try with "Bearer "
    // defaultHeaders['Authorization'] = `Bearer ${token}`

    // console.log("Authorization header set:", defaultHeaders['Authorization'])
  } else {
    console.warn("No token found for API request to:", endpoint)
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  console.log("Full request config:", {
    url,
    method: config.method || 'GET',
    headers: config.headers
  })

  try {
    const response = await fetch(url, config)

    console.log("Response status:", response.status)
    console.log("Response headers:", [...response.headers.entries()])

    // Try to parse response as JSON
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
      // console.log("Response data:", data)
    } else {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 200)}`)
    }

    if (!response.ok) {
      console.error("API Error Response:", data)
      throw new Error(data.message || `API Error: ${response.status} - ${JSON.stringify(data)}`)
    }

    return data
  } catch (error) {
    console.error('API Error Details:', {
      endpoint,
      url,
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Helper function to get cookie value (client-side only)
const getCookie = name => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  console.log("All cookies:", cookies)

  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name) {
      console.log(`Found cookie ${name}:`, value)
      return value
    }
  }

  console.log(`Cookie ${name} not found`)
  return null
}

// Helper function to set cookie (client-side only)
export const setCookie = (name, value, days = 30) => {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`

  // Also store in localStorage for redundancy
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(name, value)
  }

  console.log(`Cookie set: ${name}=${value.substring(0, 20)}...`)
}

// Helper function to remove cookie (client-side only)
export const removeCookie = name => {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`

  // Also remove from localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(name)
  }
}

// Auth API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    console.log("Attempting login with:", { email })

    const response = await apiRequest('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    console.log("Login response:", response)

    // Store token after successful login
    const token = response.data?.accessToken
    if (token) {
      setCookie('token', token, 30)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', token)
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
      }
      console.log("Token stored successfully")
    } else {
      console.error("No token in login response:", response)
    }

    return response
  },

  // Register user
  register: async userData => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST'
      })
    } finally {
      removeCookie('token')
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  // Forgot password
  forgotPassword: async email => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    })
  }
}

// User API calls (Enhanced)
export const userAPI = {
  // Get all users with pagination
  getAllUsers: async (page = 1, limit = 10) => {
    return apiRequest(`/user/?page=${page}&limit=${limit}`);
  },

  // Get user by ID (handles both transporter and shipper)
  getUserById: async (id, userType) => {
    if (userType === 'TRANSPORTER') {
      return apiRequest(`/transporter/${id}`);
    } else if (userType === 'SHIPPER') {
      return apiRequest(`/shipper/${id}`);
    }
    return apiRequest(`/user/${id}`);
  },

  // Update user status
  updateUserStatus: async (id, status, userType) => {
    if (userType === 'TRANSPORTER') {
      return apiRequest(`/transporter/approve-transporter-profile`, {
        method: 'PUT',
        body: JSON.stringify({
          transporter_id: id,
          status: status
        })
      });
    } else if (userType === 'SHIPPER') {
      return apiRequest(`/shipper/status/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: status
        })
      });
    }
  },

  // Approve user
  approveUser: async (id, userType) => {
    return userAPI.updateUserStatus(id, 'approved', userType);
  },

  // Reject user
  rejectUser: async (id, userType) => {
    return userAPI.updateUserStatus(id, 'rejected', userType);
  },

  // Delete user
  deleteUser: async (id, userType) => {
    if (userType === 'TRANSPORTER') {
      return apiRequest(`/transporter/${id}`, {
        method: 'DELETE'
      });
    } else if (userType === 'SHIPPER') {
      return apiRequest(`/shipper/${id}`, {
        method: 'DELETE'
      });
    }
    return apiRequest(`/user/${id}`, {
      method: 'DELETE'
    });
  }
};

// Admin API calls
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async (month, year) => {
    return apiRequest(`/stats/admin?month=${month}&year=${year}`);
  },

  // Get all admin users
  getAdminUsers: async () => {
    return apiRequest('/admin/users')
  },

  // Create admin user
  createAdmin: async adminData => {
    return apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(adminData)
    })
  },

  // Update admin user
  updateAdmin: async (adminId, adminData) => {
    return apiRequest(`/admin/users/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(adminData)
    })
  },

  // Delete admin user
  deleteAdmin: async adminId => {
    return apiRequest(`/admin/users/${adminId}`, {
      method: 'DELETE'
    })
  }
}

export const transporterAPI = {
  // Get all transporters
  getAllTransporters: async () => {
    return apiRequest('/transporter/all')
  },

  // Get transporter by ID
  getTransporterById: async id => {
    return apiRequest(`/transporter/${id}`)
  },

  // Approve transporter profile
  approveTransporter: async (transporter_id) => {
    return apiRequest('/transporter/approve-transporter-profile', {
      method: 'PATCH',
      body: JSON.stringify({
        transporter_id: transporter_id,
        status: 'approved'
      })
    })
  },

  // Reject transporter profile
  rejectTransporter: async (transporter_id) => {
    return apiRequest('/transporter/reject-transporter-profile', {
      method: 'PUT',
      body: JSON.stringify({
        transporter_id: transporter_id,
        status: 'rejected'
      })
    })
  },

  // Update transporter
  updateTransporter: async (id, data) => {
    return apiRequest(`/transporter/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Delete transporter
  deleteTransporter: async id => {
    return apiRequest(`/transporter/${id}`, {
      method: 'DELETE'
    })
  },

  // Get transporter statistics
  getTransporterStats: async () => {
    return apiRequest('/transporter/stats')
  },

  // Bulk approve transporters
  bulkApprove: async ids => {
    return apiRequest('/transporter/bulk-approve', {
      method: 'POST',
      body: JSON.stringify({ ids, status: 'approved' })
    })
  },

  // Bulk reject transporters
  bulkReject: async ids => {
    return apiRequest('/transporter/bulk-reject', {
      method: 'POST',
      body: JSON.stringify({ ids, status: 'rejected' })
    })
  }
}


// Shipment API calls
export const shipmentAPI = {
  // Get all pending shipments
  getPendingShipments: async () => {
    return apiRequest('/shipment/admin/pending');
  },

  // Get shipment by ID
  getShipmentById: async (id) => {
    return apiRequest(`/shipment/${id}`);
  },

  // Update shipment status
  updateShipmentStatus: async (shipment_id, status) => {
    return apiRequest(`/shipment/status/${shipment_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        shipment_id: shipment_id,
        status: status
      })
    });
  },

  // Approve shipment (move to BIDDING)
  approveShipment: async (shipment_id) => {
    return shipmentAPI.updateShipmentStatus(shipment_id, 'BIDDING');
  },

  // Reject/Cancel shipment
  rejectShipment: async (shipment_id) => {
    return shipmentAPI.updateShipmentStatus(shipment_id, 'CANCELLED');
  },

  // Get shipment by status
  getShipmentsByStatus: async (status) => {
    return apiRequest(`/shipment/status/${status}`);
  }
};

// FAQ API calls
export const faqAPI = {
  // Get all FAQs
  getAllFAQs: async (page = 1, limit = 10) => {
    return apiRequest(`/faqs?page=${page}&limit=${limit}`);
  },

  // Get FAQ by ID
  getFAQById: async (id) => {
    return apiRequest(`/faqs/${id}`);
  },

  // Create new FAQ
  createFAQ: async (data) => {
    return apiRequest('/faqs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Update FAQ
  updateFAQ: async (id, data) => {
    return apiRequest(`/faqs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Delete FAQ
  deleteFAQ: async (id) => {
    return apiRequest(`/faqs/${id}`, {
      method: 'DELETE'
    });
  }
};

export const settingsAPI = {
  // Get About Us
  getAboutUs: async () => {
    return apiRequest('/setting/about');
  },

  // Update About Us
  updateAboutUs: async (description) => {
    return apiRequest('/setting/about', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Get Privacy Policy
  getPrivacyPolicy: async () => {
    return apiRequest('/setting/privacy');
  },

  // Update Privacy Policy
  updatePrivacyPolicy: async (description) => {
    return apiRequest('/setting/privacy', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Get Terms & Conditions
  getTermsConditions: async () => {
    return apiRequest('/setting/terms');
  },

  // Update Terms & Conditions
  updateTermsConditions: async (description) => {
    return apiRequest('/setting/terms', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Get Hiring
  getHiring: async () => {
    return apiRequest('/setting/hiring');
  },

  // Update Hiring
  updateHiring: async (description) => {
    return apiRequest('/setting/hiring', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Get Insurance
  getInsurance: async () => {
    return apiRequest('/setting/insurance');
  },

  // Update Insurance
  updateInsurance: async (description) => {
    return apiRequest('/setting/insurance', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Get Carrier Data
  getCarrierData: async () => {
    return apiRequest('/setting/carrier');
  },

  // Update Carrier Data
  updateCarrierData: async (description) => {
    return apiRequest('/setting/carrier', {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  },

  // Generic update function
  updateSetting: async (type, description) => {
    const endpoints = {
      'privacy-security': '/setting/privacy',
      'terms-conditions': '/setting/terms',
      'about-us': '/setting/about',
      'hiring': '/setting/hiring',
      'insurance': '/setting/insurance',
      'carrier-data': '/setting/carrier'
    };
    
    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Invalid setting type: ${type}`);
    }
    
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ description })
    });
  }
};

// Bid API calls
export const bidAPI = {
  // Get all bids (bidding shipments)
  getAllBids: async () => {
    return apiRequest('/bid/');
  },

  // Get bids by shipment ID
  getBidsByShipment: async (shipmentId) => {
    return apiRequest(`/bid/${shipmentId}`);
  },

  // Create a new bid
  createBid: async (bidData) => {
    return apiRequest('/bid/', {
      method: 'POST',
      body: JSON.stringify(bidData)
    });
  },

  // Accept a bid
  acceptBid: async (bidId) => {
    return apiRequest(`/bid/${bidId}/accept`, {
      method: 'PATCH'
    });
  },

  // Get shipment bids (for admin)
  getShipmentBids: async (shipmentId) => {
    return apiRequest(`/shipment/${shipmentId}/bids`);
  }
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  admin: adminAPI,
  transporter: transporterAPI,
  shipment: shipmentAPI,
  faq: faqAPI,
  settings: settingsAPI,
  bid: bidAPI,
  setCookie,
  removeCookie,
  getCookie
}