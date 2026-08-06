import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default environment keys
const defaultUrl = import.meta.env.VITE_SUPABASE_URL || '';
const defaultKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Retrieve saved config from localStorage if set manually
export function getStoredSupabaseCredentials() {
  const url = localStorage.getItem('SANTA_SALSA_SUPABASE_URL') || defaultUrl;
  const key = localStorage.getItem('SANTA_SALSA_SUPABASE_KEY') || defaultKey;
  return { url, key };
}

export function saveSupabaseCredentials(url: string, key: string) {
  localStorage.setItem('SANTA_SALSA_SUPABASE_URL', url.trim());
  localStorage.setItem('SANTA_SALSA_SUPABASE_KEY', key.trim());
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  let { url, key } = getStoredSupabaseCredentials();
  if (!url || !key || url === 'YOUR_SUPABASE_URL' || key === 'YOUR_SUPABASE_KEY') {
    return null;
  }

  // Clean up URL if user accidentally included /rest/v1 or trailing slashes
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Broadcast Channel Fallback for local real-time demo across tabs
const BROADCAST_CHANNEL_NAME = 'santa_salsa_perros_channel';

export const localBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  : null;
