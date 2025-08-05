import './app/app.element';

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
  } else {
    initializeScript();
  }

  function initializeScript() {
    // Create and inject the custom element
    const appElement = document.createElement('zeeko-root');
    document.body.appendChild(appElement);
  }
})();
