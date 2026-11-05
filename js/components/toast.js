/**
 * NSTUANS Design System - Toast Notification Component
 * Accessible, lightweight toast messages for feedback
 */

(function () {
  'use strict';

  let container = null;

  function ensureContainer() {
    if (!container || !document.body.contains(container)) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  }

  const Toast = {
    show: function (message, type = 'info', duration = 4000) {
      const parent = ensureContainer();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');

      let icon = 'ℹ️';
      if (type === 'success') icon = '✓';
      if (type === 'error') icon = '✕';

      toast.innerHTML = `
        <span style="font-weight: bold;">${icon}</span>
        <span style="flex: 1;">${message}</span>
      `;

      parent.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    success: function (message, duration) {
      this.show(message, 'success', duration);
    },

    error: function (message, duration) {
      this.show(message, 'error', duration);
    },

    info: function (message, duration) {
      this.show(message, 'info', duration);
    }
  };

  window.NSTUANS_Toast = Toast;
})();
