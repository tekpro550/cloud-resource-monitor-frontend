// Centralized configuration for API settings
export const API_CONFIG = {
  BASE_URL: 'https://cloud-resource-monitor-backend.azurewebsites.net/api',
  // Replace this with your actual Azure Function key
  // You can find this in Azure Portal > Function App > App keys
  FUNCTION_KEY: 'm_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Default retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Helper function to build API URLs with consistent key parameter
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}/${endpoint}`);
  
  // Add the function key
  url.searchParams.append('code', API_CONFIG.FUNCTION_KEY);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Helper function for API requests with error handling
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

