// Get the correct API URL based on current hostname
export const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing via IP address or domain (not localhost), use same host for API
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:8000/api`;
  }
  
  // Default to localhost for local development
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();
