/**
 * Security Validation Script
 * Prevents browsers from flagging the site as dangerous
 */

(function () {
  // Validate the current page URL
  function validateURL() {
    const validDomains = ["swiftpurse.com", "www.swiftpurse.com"];
    const currentDomain = window.location.hostname;

    if (!validDomains.includes(currentDomain)) {
      console.warn("Security Warning: Domain not recognized");
      document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <h1 style="color: #d00000;">Security Warning</h1>
          <p>You are attempting to access SwiftPurse from an unauthorized domain.</p>
          <p>Please only use our official website: <a href="https://swiftpurse.onrender.com">https://swiftpurse.onrender.com</a></p>
        </div>
      `;
      return false;
    }
    return true;
  }

  // Validate HTTPS connection
  function validateHTTPS() {
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      console.warn("Security Warning: Not using HTTPS");
      window.location.href =
        "https://" + window.location.host + window.location.pathname;
      return false;
    }
    return true;
  }

  // Check for phishing attempts
  function checkForPhishing() {
    // Check if the page is in an iframe (could be clickjacking)
    if (window.self !== window.top) {
      console.warn("Security Warning: Page is being framed");
      window.top.location = window.self.location;
      return false;
    }
    return true;
  }

  // Initialize security checks
  function initSecurity() {
    const checks = [validateURL, validateHTTPS, checkForPhishing];

    for (const check of checks) {
      if (!check()) {
        return false;
      }
    }

    return true;
  }

  // Run security checks when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSecurity);
  } else {
    initSecurity();
  }

  // Additional security measures
  Object.freeze(Object.prototype);
  Object.freeze(Array.prototype);
  Object.freeze(Function.prototype);
})();
