/**
 * NSTUANS - Administrative Authentication & RBAC Service
 * Uses Supabase Auth and admin_profiles table for role-based authorization.
 * Handles sessions, route protection, login, logout, and unauthorized redirects.
 */

(function () {
  'use strict';

  const AuthService = {
    /**
     * Authenticate an admin user with email and password
     */
    login: async function (email, password) {
      const client = window.NSTUANS_Config?.getClient();

      if (!client) {
        // Fallback for preview mode when Supabase client is not connected
        if (email === 'admin@nstuans.org' && password === 'admin123') {
          const mockProfile = {
            id: 'mock-super-admin-id',
            email: email,
            full_name: 'Lead Administrator',
            role: 'super_admin',
            is_active: true
          };
          localStorage.setItem('nstuans_mock_admin', JSON.stringify(mockProfile));
          return { user: mockProfile, profile: mockProfile, error: null };
        }
        return { user: null, error: { message: 'Invalid credentials or Supabase not initialized.' } };
      }

      // Live Supabase Authentication
      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        return { user: null, error: authError };
      }

      // Verify user is in admin_profiles and active
      const { data: profile, error: profileError } = await client
        .from('admin_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .eq('is_active', true)
        .single();

      if (profileError || !profile) {
        // Unauthorized user: Sign out immediately
        await client.auth.signOut();
        return {
          user: null,
          error: { message: 'Access denied: You are not an authorized administrator.' }
        };
      }

      return { user: authData.user, profile: profile, error: null };
    },

    /**
     * Sign out current admin and redirect to login
     */
    logout: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (client) {
        await client.auth.signOut();
      }
      localStorage.removeItem('nstuans_mock_admin');
      window.location.href = '/admin/login.html';
    },

    /**
     * Get current authenticated session
     */
    getSession: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        const mock = localStorage.getItem('nstuans_mock_admin');
        return mock ? { user: JSON.parse(mock) } : null;
      }
      const { data } = await client.auth.getSession();
      return data?.session || null;
    },

    /**
     * Fetch the active administrator profile and role
     */
    getAdminProfile: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        const mock = localStorage.getItem('nstuans_mock_admin');
        return mock ? JSON.parse(mock) : null;
      }

      const { data: { user } } = await client.auth.getUser();
      if (!user) return null;

      const { data: profile } = await client
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

      return profile;
    },

    /**
     * Route Guard: Protects private administrative pages
     * Redirects unauthenticated visitors to login.html
     */
    requireAuth: async function (requiredRole = null) {
      const session = await this.getSession();

      if (!session) {
        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/admin/login.html?redirect=${currentPath}`;
        return false;
      }

      const profile = await this.getAdminProfile();
      if (!profile) {
        await this.logout();
        return false;
      }

      // Check role permissions
      if (requiredRole === 'super_admin' && profile.role !== 'super_admin') {
        alert('Access Denied: This operation requires Super Admin privileges.');
        window.location.href = '/admin/dashboard.html';
        return false;
      }

      // Update admin display name in top bar if element exists
      const nameEl = document.getElementById('admin-display-name');
      const roleEl = document.getElementById('admin-display-role');
      if (nameEl) nameEl.textContent = profile.full_name || profile.email;
      if (roleEl) roleEl.textContent = profile.role === 'super_admin' ? 'Super Admin' : 'Content Admin';

      return profile;
    }
  };

  window.NSTUANS_Auth = AuthService;
})();
