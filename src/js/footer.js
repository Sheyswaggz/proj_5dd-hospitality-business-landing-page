/**
 * footer.js
 * Footer functionality for Hospitality Landing Page
 * Handles dynamic copyright year, social media link tracking, and accessibility enhancements
 */

/**
 * Initialize footer functionality
 * - Updates copyright year dynamically
 * - Tracks social media link clicks
 * - Handles external link safety
 */
export function initFooter() {
  console.log('Footer module: Initializing');

  try {
    // Update copyright year
    updateCopyrightYear();

    // Initialize social media tracking
    initSocialMediaTracking();

    // Enhance external links safety
    enhanceExternalLinks();

    console.log('Footer module: Initialized successfully');
  } catch (error) {
    console.error('Footer module: Initialization error:', error);
  }
}

/**
 * Update copyright year to current year
 * Prevents hardcoded year from becoming outdated
 */
function updateCopyrightYear() {
  try {
    const copyrightYearElement = document.getElementById('copyright-year');

    if (!copyrightYearElement) {
      console.warn(
        'Footer module: Copyright year element not found (#copyright-year)'
      );
      return;
    }

    const currentYear = new Date().getFullYear();
    copyrightYearElement.textContent = currentYear.toString();

    console.log(`Footer module: Copyright year updated to ${currentYear}`);
  } catch (error) {
    console.error('Footer module: Error updating copyright year:', error);
  }
}

/**
 * Initialize social media link click tracking
 * Tracks which social media platforms users click
 */
function initSocialMediaTracking() {
  try {
    const socialLinks = document.querySelectorAll('.social-link');

    if (socialLinks.length === 0) {
      console.warn('Footer module: No social media links found');
      return;
    }

    socialLinks.forEach((link) => {
      link.addEventListener('click', handleSocialLinkClick);
    });

    console.log(
      `Footer module: Social media tracking initialized for ${socialLinks.length} links`
    );
  } catch (error) {
    console.error('Footer module: Error initializing social tracking:', error);
  }
}

/**
 * Handle social media link click
 * @param {Event} event - Click event
 */
function handleSocialLinkClick(event) {
  try {
    const link = event.currentTarget;
    const platform = link.getAttribute('data-social') || 'unknown';
    const url = link.href;

    // Log social media click (placeholder for analytics integration)
    console.log('Footer module: Social link clicked', {
      platform,
      url,
      timestamp: new Date().toISOString(),
    });

    // Check if external link is accessible
    // Note: This is a basic check. In production, consider using proper analytics
    if (url && url.startsWith('http')) {
      // Verify link has proper security attributes
      if (!link.hasAttribute('rel') || !link.rel.includes('noopener')) {
        console.warn(
          `Footer module: Social link missing noopener attribute: ${platform}`
        );
      }
    }

    // Optional: Send to analytics service
    // Example: window.gtag?.('event', 'social_click', { platform });
    // Example: window.plausible?.('Social Click', { props: { platform } });
  } catch (error) {
    console.error('Footer module: Error handling social link click:', error);
  }
}

/**
 * Enhance external links with safety checks
 * Ensures all external links have proper security attributes
 */
function enhanceExternalLinks() {
  try {
    const footerLinks = document.querySelectorAll(
      'footer[role="contentinfo"] a[href^="http"]'
    );

    if (footerLinks.length === 0) {
      console.log('Footer module: No external links found to enhance');
      return;
    }

    let enhancedCount = 0;

    footerLinks.forEach((link) => {
      // Ensure target="_blank" links have rel="noopener noreferrer"
      if (link.target === '_blank') {
        const currentRel = link.getAttribute('rel') || '';
        const relSet = new Set(currentRel.split(' ').filter(Boolean));

        if (!relSet.has('noopener')) {
          relSet.add('noopener');
          enhancedCount++;
        }

        if (!relSet.has('noreferrer')) {
          relSet.add('noreferrer');
          enhancedCount++;
        }

        const newRel = Array.from(relSet).join(' ');
        if (newRel !== currentRel) {
          link.setAttribute('rel', newRel);
        }
      }

      // Add error handling for failed external links
      link.addEventListener('error', (event) => {
        console.error(
          'Footer module: External link failed to load:',
          event.target.href
        );
      });
    });

    if (enhancedCount > 0) {
      console.log(
        `Footer module: Enhanced ${enhancedCount} external link security attributes`
      );
    } else {
      console.log('Footer module: All external links already properly configured');
    }
  } catch (error) {
    console.error('Footer module: Error enhancing external links:', error);
  }
}

/**
 * Get footer contact information
 * Utility function to extract contact details from footer
 * @returns {Object} Contact information object
 */
export function getFooterContactInfo() {
  try {
    const contactSection = document.querySelector('.footer-contact address');

    if (!contactSection) {
      console.warn('Footer module: Contact section not found');
      return null;
    }

    // Extract contact information from footer
    const phoneLink = contactSection.querySelector('a[href^="tel:"]');
    const emailLink = contactSection.querySelector('a[href^="mailto:"]');
    const addressText = contactSection.querySelector(
      '.footer-contact-item span'
    );

    const contactInfo = {
      phone: phoneLink?.textContent.trim() || null,
      phoneHref: phoneLink?.href || null,
      email: emailLink?.textContent.trim() || null,
      emailHref: emailLink?.href || null,
      address: addressText?.textContent.trim() || null,
    };

    console.log('Footer module: Contact info retrieved', contactInfo);
    return contactInfo;
  } catch (error) {
    console.error('Footer module: Error getting contact info:', error);
    return null;
  }
}

/**
 * Scroll to top functionality (optional enhancement)
 * Can be called from scroll-to-top button if implemented
 */
export function scrollToTop() {
  try {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Instant scroll for users who prefer reduced motion
      window.scrollTo({ top: 0 });
    } else {
      // Smooth scroll for users without reduced motion preference
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    console.log('Footer module: Scrolled to top');
  } catch (error) {
    console.error('Footer module: Error scrolling to top:', error);

    // Fallback to basic scroll
    try {
      window.scrollTo(0, 0);
    } catch (fallbackError) {
      console.error('Footer module: Fallback scroll failed:', fallbackError);
    }
  }
}

/**
 * Validate footer structure for accessibility
 * Development helper to ensure footer meets accessibility standards
 * @returns {Object} Validation results
 */
export function validateFooterAccessibility() {
  const results = {
    passed: true,
    issues: [],
  };

  try {
    // Check for footer landmark
    const footer = document.querySelector('footer[role="contentinfo"]');
    if (!footer) {
      results.passed = false;
      results.issues.push('Missing footer landmark with role="contentinfo"');
    }

    // Check for heading structure
    const footerHeadings = document.querySelectorAll(
      'footer[role="contentinfo"] h4'
    );
    if (footerHeadings.length === 0) {
      results.passed = false;
      results.issues.push('No section headings found in footer');
    }

    // Check social links have aria-label
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
      if (!link.hasAttribute('aria-label')) {
        results.passed = false;
        results.issues.push(
          `Social link ${index + 1} missing aria-label attribute`
        );
      }
    });

    // Check external links have proper attributes
    const externalLinks = document.querySelectorAll(
      'footer[role="contentinfo"] a[target="_blank"]'
    );
    externalLinks.forEach((link, index) => {
      const rel = link.getAttribute('rel') || '';
      if (!rel.includes('noopener')) {
        results.passed = false;
        results.issues.push(
          `External link ${index + 1} missing rel="noopener" attribute`
        );
      }
    });

    // Check navigation has aria-label
    const footerNav = document.querySelector('.footer-links nav');
    if (footerNav && !footerNav.hasAttribute('aria-label')) {
      results.passed = false;
      results.issues.push('Footer navigation missing aria-label attribute');
    }

    console.log('Footer module: Accessibility validation results', results);
  } catch (error) {
    console.error('Footer module: Error validating accessibility:', error);
    results.passed = false;
    results.issues.push(`Validation error: ${error.message}`);
  }

  return results;
}

// Export default initialization function
export default initFooter;
