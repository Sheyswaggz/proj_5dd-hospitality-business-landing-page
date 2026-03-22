/**
 * business-info.js
 * Business information section functionality
 * Handles Google Maps optimization, contact link tracking, and accessibility
 */

/**
 * Initialize business information section functionality
 * Sets up Google Maps optimization, contact tracking, and error handling
 * @returns {void}
 */
export function initBusinessInfo() {
  try {
    console.log('Initializing business information section');

    // Optimize Google Maps iframe loading
    optimizeGoogleMaps();

    // Track contact link interactions
    trackContactLinks();

    // Setup responsive Maps container
    setupResponsiveMaps();

    // Handle iframe load errors
    handleIframeErrors();

    // Setup accessibility enhancements
    setupAccessibilityEnhancements();

    console.log('Business information section initialized successfully');
  } catch (error) {
    console.error('Error initializing business information section:', error);
  }
}

/**
 * Optimize Google Maps iframe loading and performance
 * Implements lazy loading and interaction-based activation
 * @returns {void}
 */
function optimizeGoogleMaps() {
  try {
    const mapContainer = document.querySelector('.map-container');
    const mapIframe = mapContainer?.querySelector('iframe');

    if (!mapContainer || !mapIframe) {
      console.log('Google Maps iframe not found');
      return;
    }

    // Store original src for lazy loading
    const mapSrc = mapIframe.getAttribute('src');
    if (!mapSrc) {
      console.warn('Google Maps iframe has no src attribute');
      return;
    }

    // Add interaction-based loading for better performance
    const activateMap = () => {
      if (mapIframe.getAttribute('data-activated') === 'true') {
        return;
      }

      mapIframe.setAttribute('data-activated', 'true');
      console.log('Google Maps activated');

      // Remove loading indicator
      mapContainer.classList.add('map-loaded');
    };

    // Activate map on click or focus
    mapContainer.addEventListener('click', activateMap, { once: true });
    mapContainer.addEventListener('focus', activateMap, { once: true });

    // Use IntersectionObserver for viewport-based activation
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      };

      const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay before activation
            setTimeout(activateMap, 500);
            mapObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      mapObserver.observe(mapContainer);
      console.log('Google Maps IntersectionObserver activated');
    } else {
      // Fallback: activate immediately if IntersectionObserver not supported
      activateMap();
    }

    console.log('Google Maps optimization initialized');
  } catch (error) {
    console.error('Error optimizing Google Maps:', error);
  }
}

/**
 * Track contact link interactions for analytics
 * Logs phone, email, and directions link clicks
 * @returns {void}
 */
function trackContactLinks() {
  try {
    // Track phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const phoneNumber = link.getAttribute('href')?.replace('tel:', '');
        console.log('Contact tracking: Phone call initiated', {
          phoneNumber,
          timestamp: new Date().toISOString(),
          element: link.textContent
        });

        // Here you could send to analytics service
        // Example: analytics.track('phone_click', { phoneNumber });
      });
    });

    // Track email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const emailAddress = link.getAttribute('href')?.replace('mailto:', '');
        console.log('Contact tracking: Email link clicked', {
          emailAddress,
          timestamp: new Date().toISOString(),
          element: link.textContent
        });

        // Example: analytics.track('email_click', { emailAddress });
      });
    });

    // Track directions link
    const directionsLink = document.querySelector('.map-directions a');
    if (directionsLink) {
      directionsLink.addEventListener('click', (e) => {
        const directionsUrl = directionsLink.getAttribute('href');
        console.log('Contact tracking: Directions requested', {
          url: directionsUrl,
          timestamp: new Date().toISOString()
        });

        // Example: analytics.track('directions_click', { url: directionsUrl });
      });
    }

    console.log(
      `Contact link tracking initialized: ${phoneLinks.length} phone links, ${emailLinks.length} email links`
    );
  } catch (error) {
    console.error('Error tracking contact links:', error);
  }
}

/**
 * Setup responsive Maps container handling
 * Adjusts map container based on viewport changes
 * @returns {void}
 */
function setupResponsiveMaps() {
  try {
    const mapContainer = document.querySelector('.map-container');

    if (!mapContainer) {
      return;
    }

    // Handle responsive container adjustments
    const handleResize = () => {
      const containerWidth = mapContainer.offsetWidth;
      const containerHeight = mapContainer.offsetHeight;

      // Log dimensions for debugging
      console.log('Map container dimensions:', {
        width: containerWidth,
        height: containerHeight,
        aspectRatio: (containerWidth / containerHeight).toFixed(2)
      });

      // Add responsive classes based on viewport
      if (containerWidth < 500) {
        mapContainer.classList.add('map-mobile');
        mapContainer.classList.remove('map-tablet', 'map-desktop');
      } else if (containerWidth < 900) {
        mapContainer.classList.add('map-tablet');
        mapContainer.classList.remove('map-mobile', 'map-desktop');
      } else {
        mapContainer.classList.add('map-desktop');
        mapContainer.classList.remove('map-mobile', 'map-tablet');
      }
    };

    // Initial check
    handleResize();

    // Listen for viewport changes with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    });

    console.log('Responsive Maps container handling initialized');
  } catch (error) {
    console.error('Error setting up responsive Maps:', error);
  }
}

/**
 * Handle iframe loading errors
 * Provides fallback UI when Google Maps fails to load
 * @returns {void}
 */
function handleIframeErrors() {
  try {
    const mapIframe = document.querySelector('.map-container iframe');

    if (!mapIframe) {
      return;
    }

    // Create error handler
    const handleLoadError = () => {
      console.error('Google Maps iframe failed to load');

      const mapContainer = mapIframe.parentElement;
      if (!mapContainer) {
        return;
      }

      // Create fallback UI
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'map-error-fallback';
      fallbackDiv.setAttribute('role', 'alert');
      fallbackDiv.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
          background-color: var(--color-neutral-100);
          border-radius: var(--radius-md);
          height: 100%;
        ">
          <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: var(--color-neutral-400);" aria-hidden="true"></i>
          <p style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin: 0;">
            <strong>Map temporarily unavailable</strong><br>
            Please use the "Get Directions" button below for navigation assistance.
          </p>
        </div>
      `;

      // Hide iframe and show fallback
      mapIframe.style.display = 'none';
      mapContainer.appendChild(fallbackDiv);

      console.log('Google Maps error fallback displayed');
    };

    // Listen for iframe errors
    mapIframe.addEventListener('error', handleLoadError, { once: true });

    // Timeout fallback if iframe doesn't load within 10 seconds
    const loadTimeout = setTimeout(() => {
      if (!mapIframe.contentDocument && !mapIframe.contentWindow) {
        handleLoadError();
      }
    }, 10000);

    // Clear timeout if iframe loads successfully
    mapIframe.addEventListener(
      'load',
      () => {
        clearTimeout(loadTimeout);
        console.log('Google Maps iframe loaded successfully');
      },
      { once: true }
    );

    console.log('Google Maps error handling initialized');
  } catch (error) {
    console.error('Error setting up iframe error handling:', error);
  }
}

/**
 * Setup accessibility enhancements for screen readers
 * Improves ARIA labels and keyboard navigation
 * @returns {void}
 */
function setupAccessibilityEnhancements() {
  try {
    // Enhance contact links with better ARIA labels
    const contactLinks = document.querySelectorAll('.contact-content a');
    contactLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const linkText = link.textContent?.trim();

      if (!link.hasAttribute('aria-label')) {
        if (href?.startsWith('tel:')) {
          link.setAttribute(
            'aria-label',
            `Call us at ${linkText || href.replace('tel:', '')}`
          );
        } else if (href?.startsWith('mailto:')) {
          link.setAttribute(
            'aria-label',
            `Email us at ${linkText || href.replace('mailto:', '')}`
          );
        }
      }
    });

    // Add keyboard navigation hints
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      mapContainer.setAttribute('tabindex', '0');
      mapContainer.setAttribute(
        'aria-label',
        'Google Maps showing business location. Press Enter to interact with map.'
      );

      // Handle keyboard activation
      mapContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          mapContainer.click();
        }
      });
    }

    // Announce hours to screen readers with proper structure
    const hoursTable = document.querySelector('.hours-table');
    if (hoursTable) {
      hoursTable.setAttribute('role', 'table');
      hoursTable.setAttribute(
        'aria-label',
        'Business hours of operation by day of the week'
      );
    }

    console.log('Accessibility enhancements initialized');
  } catch (error) {
    console.error('Error setting up accessibility enhancements:', error);
  }
}

/**
 * Get business contact information
 * Utility function to retrieve contact details from the DOM
 * @returns {Object} Contact information object
 */
export function getBusinessContactInfo() {
  try {
    const phoneLink = document.querySelector('a[href^="tel:"]');
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const addressElement = document.querySelector('[itemprop="address"]');

    const contactInfo = {
      phone: phoneLink?.getAttribute('href')?.replace('tel:', '') || null,
      email: emailLink?.getAttribute('href')?.replace('mailto:', '') || null,
      address: addressElement?.textContent?.trim() || null
    };

    console.log('Business contact info retrieved:', contactInfo);
    return contactInfo;
  } catch (error) {
    console.error('Error getting business contact info:', error);
    return { phone: null, email: null, address: null };
  }
}

/**
 * Check if business is currently open
 * Utility function to determine operating hours status
 * @returns {boolean} True if business is currently open
 */
export function isBusinessOpen() {
  try {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    // Business hours logic (customize based on actual hours)
    // Monday-Friday: 9 AM - 10 PM
    // Saturday: 8 AM - 11 PM
    // Sunday: 8 AM - 9 PM

    let isOpen = false;

    if (day >= 1 && day <= 5) {
      // Monday to Friday
      isOpen = hour >= 9 && hour < 22;
    } else if (day === 6) {
      // Saturday
      isOpen = hour >= 8 && hour < 23;
    } else if (day === 0) {
      // Sunday
      isOpen = hour >= 8 && hour < 21;
    }

    console.log('Business open status:', { isOpen, day, hour });
    return isOpen;
  } catch (error) {
    console.error('Error checking business hours:', error);
    return false;
  }
}

// Export default initialization function
export default initBusinessInfo;
