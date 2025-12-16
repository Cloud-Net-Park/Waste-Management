// Environment configuration for the application

export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://usonrakcqtxfjaajatxs.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb25yYWtjcXR4ZmphYWphdHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjgwMTUsImV4cCI6MjA3MzcwNDAxNX0.2zvxSKCwos80m1YwPGWhvur_v1QSTWvT3HFW4hP76Bk"
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "Waste Management System",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    debugMode: import.meta.env.VITE_DEBUG_MODE === "true" || false
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
  },
  
  // Environment info
  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE
  }
};

// Helper function to check if all required environment variables are set
export const validateConfig = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    console.warn('Please check your .env.local file and ensure all required variables are set.');
  }
  
  return missingVars.length === 0;
};

// Log configuration in development mode
if (config.app.debugMode) {
  console.log('App Configuration:', {
    name: config.app.name,
    version: config.app.version,
    environment: config.env.mode,
    supabaseUrl: config.supabase.url,
    debugMode: config.app.debugMode
  });
  
  validateConfig();
}