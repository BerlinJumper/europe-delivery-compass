/**
 * Environment variables used throughout the application
 * Using this pattern to ensure type safety and centralized management
 */

// Get the Google Maps API key from Vite's environment variables
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Add a warning if the key is not properly set up
if (!GOOGLE_MAPS_API_KEY) {
  console.warn("Google Maps API key is not set. Autocomplete functionality will be limited.");
} 