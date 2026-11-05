/**
 * NSTUANS Design System - Reusable Modal & Confirmation Dialog Component
 * Fully accessible, backdrop dismiss, ESC key handler, and dynamic confirmation dialog API.
 */

(function () {
  'use strict';

  const Modal = {
    // Open an existing modal element by ID or Element reference
    open: function (modalOrId) {
      const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
      if (!modal) return;

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Find first focusable element
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },

    // Close an active modal
    close: function (modalOrId) {
      let modal;
      if (modalOrId) {
        modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
      } else {
        modal = document.querySelector('.modal-backdrop.is-active');
      }

      if (!modal) return;

      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');

      // Check if other modals remain open before restoring body scroll
      if (!document.querySelector('.modal-backdrop.is-active')) {
        document.body.style.overflow = '';
      }
    },

    // Programmatic Confirmation Dialog
    confirm: function (options) {
      const defaults = {
        title: 'Confirm Action',
        message: 'Are you sure you wish to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isDestructive: false,
        onConfirm: () => {},
        onCancel: () => {},
      };

      const settings = Object.assign({}, defaults, options);

      // Create modal DOM dynamically
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop is-active';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');

      const confirmBtnClass = settings.isDestructive ? 'btn-danger' : 'btn-primary';

      backdrop.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">${settings.title}</h3>
            <button class="modal-close-btn" type="button" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-body">
            <p>${settings.message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" type="button" data-action="cancel">${settings.cancelText}</button>
            <button class="btn ${confirmBtnClass}" type="button" data-action="confirm">${settings.confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      document.body.style.overflow = 'hidden';

      function destroy() {
        backdrop.classList.remove('is-active');
        setTimeout(() => {
          backdrop.remove();
          if (!document.querySelector('.modal-backdrop.is-active')) {
            document.body.style.overflow = '';
          }
        }, 200);
      }

      const confirmBtn = backdrop.querySelector('[data-action="confirm"]');
      const cancelBtn = backdrop.querySelector('[data-action="cancel"]');
      const closeBtn = backdrop.querySelector('.modal-close-btn');

      confirmBtn.focus();

      confirmBtn.addEventListener('click', () => {
        destroy();
        if (typeof settings.onConfirm === 'function') settings.onConfirm();
      });

      cancelBtn.addEventListener('click', () => {
        destroy();
        if (typeof settings.onCancel === 'function') settings.onCancel();
      });

      closeBtn.addEventListener('click', () => {
        destroy();
        if (typeof settings.onCancel === 'function') settings.onCancel();
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          destroy();
          if (typeof settings.onCancel === 'function') settings.onCancel();
        }
      });
    },

    init: function () {
      // Event delegation for static modal triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger) {
          e.preventDefault();
          const targetId = trigger.getAttribute('data-modal-target');
          Modal.open(targetId);
        }

        const dismiss = e.target.closest('[data-modal-dismiss], .modal-close-btn');
        if (dismiss) {
          e.preventDefault();
          const modal = dismiss.closest('.modal-backdrop');
          if (modal) Modal.close(modal);
        }

        if (e.target.classList.contains('modal-backdrop')) {
          Modal.close(e.target);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          Modal.close();
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Modal.init);
  } else {
    Modal.init();
  }

  window.NSTUANS_Modal = Modal;
})();
