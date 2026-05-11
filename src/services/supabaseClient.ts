
import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
// We use a helper to prevent "Cannot read properties of undefined" if import.meta.env is missing
const getEnv = (key: string) => {
  try {
    return (import.meta && import.meta.env && import.meta.env[key]) || '';
  } catch (e) {
    console.warn(`Error accessing env var ${key}`, e);
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Create a single supabase client for interacting with your database
// We provide a fallback URL to prevent 'supabaseUrl is required' errors if env vars are missing.
const clientUrl = supabaseUrl || 'https://placeholder.supabase.co';
const clientKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(clientUrl, clientKey);
