// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://wormy-powerfest-backend.onrender.com',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Registrations
  REGISTER: '/api/registrations',
  GET_REGISTRATIONS: '/api/registrations',
  GET_REGISTRATION_BY_ID: (id: string) => `/api/registrations/${id}`,
  
  // Verification
  VERIFY_TICKET: '/api/verify',
  CHECK_IN: (id: string) => `/api/registrations/${id}/check-in`,
  
  // Stats
  GET_STATS: '/api/stats',
} as const;
