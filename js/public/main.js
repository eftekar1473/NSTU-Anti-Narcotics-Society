/**
 * NSTUANS - Public Website Client Script
 * Handles client-side navigation, form validation, dynamic detail routing,
 * tabs, and lightbox functionality.
 */

(function () {
  'use strict';

  // ==========================================================================
  // Form Validation Utilities
  // ==========================================================================
  const Validators = {
    isValidEmail: function (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },
    isValidPhone: function (phone) {
      // Allows BD formats: 01XXXXXXXXX, +8801XXXXXXXXX, or standard 10-14 digits
      const re = /^(?:\+?88)?01[3-9]\d{8}$/;
      return re.test(phone.replace(/[\s-]/g, ''));
    },
    isValidStudentId: function (id) {
      return id && id.trim().length >= 4;
    }
  };

  // Expose Validators globally
  window.NSTUANS_Validators = Validators;

  // ==========================================================================
  // Lightbox Functionality for Gallery
  // ==========================================================================
  function initLightbox() {
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'gallery-lightbox';
      lightbox.className = 'modal-backdrop';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.innerHTML = `
        <div class="modal-dialog" style="max-width: 900px; background: transparent; box-shadow: none; align-items: center;">
          <div style="position: relative; max-width: 100%;">
            <button class="modal-close-btn" type="button" aria-label="Close Lightbox" style="position: absolute; top: -40px; right: 0; color: #fff; font-size: 2rem;">&times;</button>
            <img id="lightbox-image" src="" alt="Gallery Photo" style="max-height: 80vh; max-width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-xl); object-fit: contain;">
            <div id="lightbox-caption" style="color: #fff; text-align: center; margin-top: 0.75rem; font-size: 1rem; font-weight: 500;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);

      lightbox.querySelector('.modal-close-btn').addEventListener('click', () => {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('modal-dialog')) {
          lightbox.classList.remove('is-active');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
          lightbox.classList.remove('is-active');
          document.body.style.overflow = '';
        }
      });
    }

    document.querySelectorAll('[data-gallery-item]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const src = item.getAttribute('data-image-src') || item.querySelector('img')?.src;
        const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';

        const imgEl = document.getElementById('lightbox-image');
        const capEl = document.getElementById('lightbox-caption');

        if (imgEl && src) {
          imgEl.src = src;
          if (capEl) capEl.textContent = caption;
          lightbox.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // ==========================================================================
  // Generic Tab Handler
  // ==========================================================================
  function initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach((container) => {
      const tabButtons = container.querySelectorAll('[data-tab-target]');
      const targetGroup = container.getAttribute('data-tabs');
      const tabPanels = document.querySelectorAll(`[data-tab-content="${targetGroup}"]`);

      tabButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-tab-target');

          tabButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          tabPanels.forEach((panel) => {
            const panelName = panel.getAttribute('data-tab-panel');
            if (target === 'all' || panelName === target) {
              panel.style.display = '';
            } else {
              panel.style.display = 'none';
            }
          });
        });
      });
    });
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initTabs();
  });

  window.NSTUANS_Public = {
    initLightbox,
    initTabs
  };
})();
