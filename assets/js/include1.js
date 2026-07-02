/**
 * include.js — Component Loader
 * Loads HTML partials from /components/ folder using Fetch API
 * Similar to PHP include() functionality
 */

(function() {
  'use strict';

  // List of all components with their container IDs and file paths
  const components = [
    { id: 'header-container', path: 'components/header.html' },
    { id: 'hero-container', path: 'components/hero.html' },
    { id: 'trusted-container', path: 'components/trusted.html' },
    { id: 'features-container', path: 'components/features.html' },
    { id: 'how-it-works-container', path: 'components/how-it-works.html' },
    { id: 'hardware-container', path: 'components/hardware.html' },
    { id: 'dashboard-preview-container', path: 'components/dashboard-preview.html' },
    { id: 'pricing-container', path: 'components/pricing.html' },
    { id: 'testimonials-container', path: 'components/testimonials.html' },
    { id: 'faq-container', path: 'components/faq.html' },
    { id: 'contact-container', path: 'components/contact.html' },
    { id: 'footer-container', path: 'components/footer.html' }
  ];

  let loadedCount = 0;
  const totalComponents = components.length;

  /**
   * Load a single component via Fetch API
   * @param {string} containerId - DOM element ID to inject HTML into
   * @param {string} filePath - Path to the component HTML file
   */
  function loadComponent(containerId, filePath) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} — ${filePath}`);
        }
        return response.text();
      })
      .then(html => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = html;
        } else {
          console.warn(`Container #${containerId} not found in DOM.`);
        }
        onComponentLoaded();
      })
      .catch(error => {
        console.error(`Failed to load component: ${filePath}`, error);
        // Still count as loaded to avoid infinite loading screen
        onComponentLoaded();
      });
  }

  /**
   * Called after each component loads or fails
   * Hides loading screen when all components are processed
   */
  function onComponentLoaded() {
    loadedCount++;
    if (loadedCount === totalComponents) {
      // All components have been attempted
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
      // Dispatch event to signal that components are ready
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
  }

  // Start loading all components in parallel
  components.forEach(({ id, path }) => {
    loadComponent(id, path);
  });

  // Safety timeout: hide loading screen after 8 seconds even if some components fail
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
  }, 8000);

})();