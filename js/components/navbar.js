/**
 * NSTUANS Design System - Navbar Component
 * Enforces the strict 6-item navigation order:
 * 1. About (Dropdown: Who We Are, Mission, Vision, History, Goals)
 * 2. Events
 * 3. Leaders
 * 4. Gallery
 * 5. Contact
 * 6. Join Us (CTA)
 */

(function () {
  'use strict';

  function initNavbar() {
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const toggleBtn = document.querySelector('.nav-toggle-btn');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const desktopDropdown = document.querySelector('.nav-dropdown');

    // 1. Sticky Navbar on Scroll
    if (navbarWrapper) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          navbarWrapper.classList.add('navbar-scrolled');
        } else {
          navbarWrapper.classList.remove('navbar-scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    // 2. Active Route Highlighter
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-dropdown-item');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const cleanHref = href.toLowerCase().replace(/\/index\.html$/, '/');
      const isHome = (cleanHref === '/' || cleanHref === './' || cleanHref === 'index.html') &&
                     (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('nstuans/') || currentPath === '');

      const isSubRoute = cleanHref !== '/' && cleanHref !== './' && currentPath.includes(cleanHref.replace(/^\//, ''));

      if (isHome || isSubRoute) {
        link.classList.add('active');
        // If dropdown item is active, highlight the parent dropdown button
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const parentToggle = parentDropdown.querySelector('.nav-link');
          if (parentToggle) parentToggle.classList.add('active');
        }
      }
    });

    // 3. Mobile Hamburger Menu Toggle
    function toggleMobileMenu(isOpen) {
      const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer?.classList.contains('is-open');

      if (shouldOpen) {
        toggleBtn?.classList.add('is-active');
        mobileDrawer?.classList.add('is-open');
        mobileOverlay?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        toggleBtn?.classList.remove('is-active');
        mobileDrawer?.classList.remove('is-open');
        mobileOverlay?.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => toggleMobileMenu());
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleMobileMenu(false);
      }
    });

    // 4. Mobile Dropdown Toggle (Accordion)
    if (mobileDropdownToggle && mobileDropdown) {
      mobileDropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        mobileDropdown.classList.toggle('is-open');
      });
    }

    // 5. Desktop Dropdown Keyboard Accessibility
    if (desktopDropdown) {
      const toggle = desktopDropdown.querySelector('.nav-dropdown-toggle');
      const menu = desktopDropdown.querySelector('.dropdown-menu');

      if (toggle && menu) {
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            menu.classList.toggle('show');
            const firstItem = menu.querySelector('a');
            if (firstItem) firstItem.focus();
          }
        });
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }

  // Export for programmatic reinitialization
  window.NSTUANS_Navbar = { init: initNavbar };
})();
