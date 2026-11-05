/**
 * NSTUANS - Supabase Client Configuration
 * Initializes the Supabase JavaScript client using public, frontend-safe keys only.
 * NEVER place privileged administrator master keys or database passwords in frontend files.
 */

(function () {
  'use strict';

  // Default / Placeholder configuration (replaced via .env or runtime config)
  const SUPABASE_CONFIG = {
    url: window.NSTUANS_SUPABASE_URL || 'https://xyzcompany.supabase.co',
    anonKey: window.NSTUANS_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
  };

  // Attempt to load from localStorage if configured dynamically by admin
  const storedUrl = localStorage.getItem('NSTUANS_SUPABASE_URL');
  const storedKey = localStorage.getItem('NSTUANS_SUPABASE_ANON_KEY');

  if (storedUrl && storedKey) {
    SUPABASE_CONFIG.url = storedUrl;
    SUPABASE_CONFIG.anonKey = storedKey;
  }

  let supabaseClient = null;

  function getClient() {
    if (supabaseClient) return supabaseClient;

    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return supabaseClient;
    }

    console.warn('NSTUANS: Supabase JS library not loaded or initialized yet.');
    return null;
  }

  window.NSTUANS_Config = {
    getConfig: () => Object.assign({}, SUPABASE_CONFIG),
    getClient: getClient,
    setCredentials: (url, anonKey) => {
      localStorage.setItem('NSTUANS_SUPABASE_URL', url);
      localStorage.setItem('NSTUANS_SUPABASE_ANON_KEY', anonKey);
      SUPABASE_CONFIG.url = url;
      SUPABASE_CONFIG.anonKey = anonKey;
      supabaseClient = null; // Reset client
    }
  };
})();
