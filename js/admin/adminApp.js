/**
 * NSTUANS - Admin App Core Controller
 * Handles authentication checks, sidebar navigation, mobile toggling, and shared utilities.
 */

(function () {
  'use strict';

  async function initAdminApp(options = {}) {
    const requiredRole = options.requiredRole || null;

    // 1. Session & Role Verification Guard
    let profile = null;
    if (window.NSTUANS_Auth) {
      profile = await window.NSTUANS_Auth.requireAuth(requiredRole);
      if (!profile) return; // Redirected
    }

    // 2. Active Sidebar Link Detection
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href.replace(/^\.\//, ''))) {
        link.classList.add('active');
      }
    });

    // 3. User initials and Profile Header
    if (profile) {
      const avatarEl = document.getElementById('admin-avatar-initials');
      if (avatarEl) {
        const initials = profile.full_name
          ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          : 'AD';
        avatarEl.textContent = initials;
      }
      const nameEl = document.getElementById('admin-user-name');
      const roleEl = document.getElementById('admin-user-role');
      if (nameEl) nameEl.textContent = profile.full_name || profile.email;
      if (roleEl) roleEl.textContent = profile.role === 'super_admin' ? 'Super Admin' : 'Content Admin';
    }

    // 4. Mobile Sidebar Toggle
    const menuToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });

      // Close when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('is-open')) {
          if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('is-open');
          }
        }
      });
    }

    // 5. Logout Button Handler
    const logoutBtns = document.querySelectorAll('[data-action="logout"]');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.NSTUANS_Modal) {
          NSTUANS_Modal.confirm({
            title: 'Sign Out Confirmation',
            message: 'Are you sure you want to end your administrative session?',
            confirmText: 'Sign Out',
            cancelText: 'Stay',
            isDestructive: false,
            onConfirm: () => {
              if (window.NSTUANS_Auth) window.NSTUANS_Auth.logout();
            }
          });
        } else {
          if (confirm('Are you sure you want to sign out?')) {
            if (window.NSTUANS_Auth) window.NSTUANS_Auth.logout();
          }
        }
      });
    });
  }

  window.NSTUANS_AdminApp = {
    init: initAdminApp,
    escapeHtml: function (str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };
})();
