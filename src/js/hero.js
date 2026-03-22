/**
 * hero.js
 * Hero section JavaScript functionality
 * Handles morphing button interactions, lazy loading optimization,
 * and scroll-triggered animations for the hero section
 */

/**
 * Initialize hero section functionality
 */
export function initHero() {
  initLazyLoadHeroImage();
  initMorphingButton();
  initScrollReveal();
  initButtonInteractions();
}

/**
 * Lazy load hero image with skeleton state
 * Optimizes initial page load by showing skeleton until image loads
 */
function initLazyLoadHeroImage() {
  const heroImage = document.querySelector('.hero-image');
  const img = heroImage?.querySelector('img');

  if (!img || !heroImage) {
    return;
  }

  // Add loading class for skeleton state
  heroImage.classList.add('loading');

  // Handle image load
  const handleImageLoad = () => {
    heroImage.classList.remove('loading');
    img.style.opacity = '0';
    requestAnimationFrame(() => {
      img.style.transition = 'opacity 0.6s ease';
      img.style.opacity = '1';
    });
  };

  // Handle image error
  const handleImageError = () => {
    heroImage.classList.remove('loading');
    console.error('Hero image failed to load');
  };

  // Check if image is already loaded (cached)
  if (img.complete && img.naturalHeight !== 0) {
    handleImageLoad();
  } else {
    img.addEventListener('load', handleImageLoad, { once: true });
    img.addEventListener('error', handleImageError, { once: true });
  }
}

/**
 * Initialize morphing button interactions
 * Adds hover, active, and focus effects to CTA buttons
 */
function initMorphingButton() {
  const primaryCTA = document.querySelector('.hero-cta-primary');

  if (!primaryCTA) {
    return;
  }

  // Mouse move effect for morphing interaction
  primaryCTA.addEventListener('mousemove', (e) => {
    const rect = primaryCTA.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple effect at cursor position
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: ripple-effect 0.6s ease-out;
    `;

    primaryCTA.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Add keyboard interaction feedback
  primaryCTA.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      primaryCTA.classList.add('active');
    }
  });

  primaryCTA.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      primaryCTA.classList.remove('active');
    }
  });
}

/**
 * Initialize scroll-triggered reveal animation
 * Reveals hero content with fade-in effect on scroll
 */
function initScrollReveal() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');

  if (!heroContent || !heroImage) {
    return;
  }

  // Intersection Observer for scroll reveal
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  observer.observe(heroContent);
  observer.observe(heroImage);
}

/**
 * Initialize button interactions
 * Handles click tracking and smooth scrolling for CTA buttons
 */
function initButtonInteractions() {
  const ctaButtons = document.querySelectorAll('.hero-cta a');

  ctaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const href = button.getAttribute('href');

      // Handle anchor links with smooth scroll
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL without jumping
          history.pushState(null, '', href);

          // Focus the target for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      }

      // Track CTA clicks (for analytics)
      trackCTAClick(button);
    });
  });
}

/**
 * Track CTA button clicks
 * @param {HTMLElement} button - The clicked button element
 */
function trackCTAClick(button) {
  const buttonText = button.textContent.trim();
  const buttonHref = button.getAttribute('href');

  // Log for debugging
  console.log('CTA clicked:', {
    text: buttonText,
    href: buttonHref,
    timestamp: new Date().toISOString(),
  });

  // Send to analytics if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: buttonText,
      value: buttonHref,
    });
  }

  // Send to custom analytics if available
  if (typeof window.analytics === 'object' && window.analytics.track) {
    window.analytics.track('CTA Clicked', {
      text: buttonText,
      href: buttonHref,
      section: 'hero',
    });
  }
}

/**
 * Add dynamic ripple effect styles
 */
function addRippleStyles() {
  if (document.getElementById('hero-ripple-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'hero-ripple-styles';
  style.textContent = `
    @keyframes ripple-effect {
      from {
        width: 0;
        height: 0;
        opacity: 1;
      }
      to {
        width: 100px;
        height: 100px;
        opacity: 0;
      }
    }

    .btn-ripple {
      z-index: 0;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Initialize all hero functionality when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addRippleStyles();
    initHero();
  });
} else {
  addRippleStyles();
  initHero();
}

// Export for use in app.js
export default initHero;
