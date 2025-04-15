// Helper functions for safely working with API routes

/**
 * Create a URL for an API endpoint, handling potential server/client side rendering differences
 * @param endpoint The API endpoint path (without /api prefix)
 * @returns The complete API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Always prepend the /api path for consistent routing
  const path = endpoint.startsWith('/') ? `api${endpoint}` : `api/${endpoint}`;
  
  // For server-side rendering or static export, use relative URLs
  return `/${path}`;
};

/**
 * Create a URL for fetching data, with proper error handling for both client and server environments
 * @param endpoint The API endpoint to fetch from
 * @returns A URL that works in both client and server contexts
 */
export const createFetchUrl = (endpoint: string): string => {
  // Always use relative URLs in production for static export compatibility
  return getApiUrl(endpoint);
};

/**
 * Safely process text that might have markdown or need sanitization
 * @param text The input text to process
 * @returns Safely processed text
 */
export const processText = (text: string | null | undefined): string => {
  // Return empty string for null/undefined to avoid common errors
  if (text === null || text === undefined) {
    return '';
  }
  
  // Simple text sanitization
  return text
    .toString()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Handle API response errors consistently
 * @param error The error object
 * @returns A formatted error message
 */
export const handleApiError = (error: any): string => {
  console.error('API error:', error);
  
  if (error?.response?.data?.message) {
    return `Error: ${error.response.data.message}`;
  }
  
  if (error?.message) {
    return `Error: ${error.message}`;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Create a fallback response for when the API is unavailable
 * @param endpoint The endpoint that was requested
 * @returns A mock response object
 */
export const createFallbackResponse = (endpoint: string): any => {
  return {
    success: false,
    isOffline: true,
    message: 'This feature requires an internet connection.',
    endpoint,
  };
};

export default {
  getApiUrl,
  createFetchUrl,
  processText,
  handleApiError,
  createFallbackResponse
}; 