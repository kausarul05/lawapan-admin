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

  console.log("Token found:", token ? "Yes" : "No")

  if (token) {
    // Try both formats - some backends need "Bearer ", some don't
    // Let's try without "Bearer " first as per your Postman
    defaultHeaders['Authorization'] = token

    // If that doesn't work, uncomment the line below to try with "Bearer "
    // defaultHeaders['Authorization'] = `Bearer ${token}`

    console.log("Authorization header set:", defaultHeaders['Authorization'])
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
      console.log("Response data:", data)
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

// User API calls
export const userAPI = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`)
  },

  // Get user by ID
  getUserById: async userId => {
    return apiRequest(`/users/${userId}`)
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  // Delete user
  deleteUser: async userId => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE'
    })
  },

  // Create user
  createUser: async userData => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }
}

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

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  admin: adminAPI,
  transporter: transporterAPI,
  shipment: shipmentAPI,
  setCookie,
  removeCookie,
  getCookie
}