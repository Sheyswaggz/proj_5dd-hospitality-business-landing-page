/**
 * scroll-animations.js
 * Scroll-triggered reveal animations using Intersection Observer API
 * Implements staggered fade-in with upward slide effects
 */

/**
 * Initialize scroll-triggered reveal animations
 * Uses Intersection Observer for performance-optimized scroll animations
 * @returns {void}
 */
export function initScrollAnimations() {
  try {
    console.log('Initializing scroll-triggered reveal animations');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      console.log(
        'Reduced motion preference detected - skipping animations'
      );
      handleReducedMotion();
      return;
    }

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      console.warn(
        'IntersectionObserver not supported - revealing all elements'
      );
      revealAllElements();
      return;
    }

    // Initialize observer for reveal animations
    setupRevealObserver();

    console.log('Scroll animations initialized successfully');
  } catch (error) {
    console.error('Error initializing scroll animations:', error);
    // Fallback: reveal all elements on error
    revealAllElements();
  }
}

/**
 * Handle reduced motion preference
 * Makes all reveal elements immediately visible without animations
 * @returns {void}
 */
function handleReducedMotion() {
  try {
    const revealElements = document.querySelectorAll('[data-reveal]');

    revealElements.forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.classList.add('revealed');
    });

    console.log(
      `Revealed ${revealElements.length} elements (reduced motion mode)`
    );
  } catch (error) {
    console.error('Error handling reduced motion:', error);
  }
}

/**
 * Reveal all elements without animations
 * Fallback for browsers without IntersectionObserver support
 * @returns {void}
 */
function revealAllElements() {
  try {
    const revealElements = document.querySelectorAll('[data-reveal]');

    revealElements.forEach((element) => {
      element.classList.add('revealed');
    });

    console.log(
      `Revealed ${revealElements.length} elements (fallback mode)`
    );
  } catch (error) {
    console.error('Error revealing all elements:', error);
  }
}

/**
 * Setup Intersection Observer for reveal animations
 * Observes elements with [data-reveal] attribute
 * @returns {void}
 */
function setupRevealObserver() {
  try {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length === 0) {
      console.log('No elements with [data-reveal] found');
      return;
    }

    // Observer configuration
    const observerOptions = {
      root: null, // Use viewport as root
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    // Create observer instance
    const observer = new IntersectionObserver((entries) => {
      handleIntersection(entries, observer);
    }, observerOptions);

    // Observe all reveal elements
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    console.log(
      `Observing ${revealElements.length} elements for scroll reveals`
    );
  } catch (error) {
    console.error('Error setting up reveal observer:', error);
    revealAllElements();
  }
}

/**
 * Handle intersection observer callback
 * Applies staggered animations to revealed elements
 * @param {IntersectionObserverEntry[]} entries - Intersection observer entries
 * @param {IntersectionObserver} observer - Observer instance
 * @returns {void}
 */
function handleIntersection(entries, observer) {
  try {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger timing: 150ms between elements as per design pattern
        const delay = index * 150;

        setTimeout(() => {
          revealElement(entry.target);
          // Stop observing once revealed for performance
          observer.unobserve(entry.target);
        }, delay);
      }
    });
  } catch (error) {
    console.error('Error handling intersection:', error);
  }
}

/**
 * Reveal a single element with animation
 * Adds 'revealed' class to trigger CSS transitions
 * @param {Element} element - Element to reveal
 * @returns {void}
 */
function revealElement(element) {
  try {
    if (!element) {
      console.warn('Cannot reveal: element is null or undefined');
      return;
    }

    // Add revealed class to trigger CSS animations
    element.classList.add('revealed');

    // Log reveal action for debugging
    const elementInfo = element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : '');
    console.log(`Revealed element: ${elementInfo}`);
  } catch (error) {
    console.error('Error revealing element:', error);
  }
}

/**
 * Reset animations (useful for testing or dynamic content)
 * Removes 'revealed' class from all reveal elements
 * @returns {void}
 */
export function resetScrollAnimations() {
  try {
    const revealElements = document.querySelectorAll('[data-reveal]');

    revealElements.forEach((element) => {
      element.classList.remove('revealed');
    });

    console.log(`Reset ${revealElements.length} reveal animations`);

    // Re-initialize animations
    initScrollAnimations();
  } catch (error) {
    console.error('Error resetting scroll animations:', error);
  }
}

/**
 * Add reveal attribute to dynamically added elements
 * Useful for content loaded after page load
 * @param {Element} element - Element to add reveal animation to
 * @returns {void}
 */
export function addRevealAnimation(element) {
  try {
    if (!element) {
      console.warn('Cannot add reveal animation: element is null or undefined');
      return;
    }

    // Add data-reveal attribute
    element.setAttribute('data-reveal', '');

    // Check if animations are active
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.classList.add('revealed');
      return;
    }

    // Create observer for new element
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealElement(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1
        }
      );

      observer.observe(element);
      console.log('Added reveal animation to dynamic element');
    } else {
      // Fallback for browsers without IntersectionObserver
      element.classList.add('revealed');
    }
  } catch (error) {
    console.error('Error adding reveal animation:', error);
  }
}

// Export default initialization function
export default initScrollAnimations;
