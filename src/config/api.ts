export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  ENDPOINTS: {
    SEARCH_JOBS: '/api/search-jobs', // Updated path
  },
  TIMEOUT: 10000, // 10 seconds
} as const;
