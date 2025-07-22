// API Configuration for Surge.sh frontend with Vercel backend
export const API_BASE_URL = process.env.VERCEL_API_URL || 'https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app';

export const API_ENDPOINTS = {
  // Authentication
  register: `${API_BASE_URL}/api/register`,
  login: `${API_BASE_URL}/api/login`,
  logout: `${API_BASE_URL}/api/logout`,
  me: `${API_BASE_URL}/api/me`,
  
  // Customers
  customers: `${API_BASE_URL}/api/customers`,
  customer: (id: string) => `${API_BASE_URL}/api/customers/${id}`,
  
  // Deals
  deals: `${API_BASE_URL}/api/deals`,
  deal: (id: string) => `${API_BASE_URL}/api/deals/${id}`,
};

// Helper function to make API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(endpoint, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
} 