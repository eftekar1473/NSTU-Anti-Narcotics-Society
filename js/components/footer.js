/**
 * NSTUANS Design System - Footer Component
 * Dynamic copyright year and university links helper
 */

(function () {
  'use strict';

  function initFooter() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

  window.NSTUANS_Footer = { init: initFooter };
})();
