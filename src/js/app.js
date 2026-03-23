/**
 * app.js
 * Main application entry point for Hospitality Landing Page
 * Coordinates all JavaScript modules and initializes functionality
 */

import initHero from './hero.js';
import initServices from './services.js';
import initScrollAnimations from './scroll-animations.js';
import initBusinessInfo from './business-info.js';
import initFooter from './footer.js';

/**
 * Initialize application
 */
function initApp() {
  console.log('Hospitality Landing Page - JavaScript loaded successfully');

  // Initialize hero section functionality
  initHero();

  // Initialize services section functionality
  initServices();

  // Initialize business information section functionality
  initBusinessInfo();

  // Initialize footer functionality
  initFooter();

  // Initialize scroll-triggered reveal animations
  initScrollAnimations();

  // Initialize scroll reveal animations for other sections
  initScrollRevealAnimations();

  // Initialize form handling (when form module is available)
  initFormHandling();

  // Log initialization complete
  console.log('Application initialized successfully');
}

/**
 * Initialize scroll-triggered reveal animations for all sections
 * Implements scroll_triggered_reveals design pattern
 */
function initScrollRevealAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Make all elements visible immediately if reduced motion is preferred
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Set initial state for reveal elements
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Intersection Observer options
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1,
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger timing: 150ms between elements as per design pattern
        const delay = index * 150;

        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Initialize form handling
 * Placeholder for contact form functionality
 */
function initFormHandling() {
  const contactForm = document.querySelector('.contact-form');

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('.btn-submit');
    const buttonText = submitButton?.querySelector('.button-text');

    if (!submitButton) {
      return;
    }

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.setAttribute('aria-busy', 'true');

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success state
      submitButton.classList.remove('loading');
      submitButton.classList.add('success');
      submitButton.setAttribute('aria-busy', 'false');

      if (buttonText) {
        buttonText.textContent = 'Message Sent!';
      }

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        submitButton.classList.remove('success');
        if (buttonText) {
          buttonText.textContent = 'Send Message';
        }
      }, 3000);

      console.log('Form submitted successfully');
    } catch (error) {
      // Show error state
      submitButton.classList.remove('loading');
      submitButton.classList.add('error');
      submitButton.setAttribute('aria-busy', 'false');

      if (buttonText) {
        buttonText.textContent = 'Error - Try Again';
      }

      // Reset error state after delay
      setTimeout(() => {
        submitButton.classList.remove('error');
        if (buttonText) {
          buttonText.textContent = 'Send Message';
        }
      }, 3000);

      console.error('Form submission error:', error);
    }
  });
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for testing or external use
export default initApp;
