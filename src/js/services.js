/**
 * services.js
 * Services section functionality including image lazy loading and content management
 * Handles lazy loading, image optimization, and error handling for service images
 */

/**
 * Initialize services section functionality
 * Sets up lazy loading and image error handling
 * @returns {void}
 */
export function initServices() {
  try {
    console.log('Initializing services section');

    // Setup lazy loading for service images
    setupLazyLoading();

    // Setup image error handling
    setupImageErrorHandling();

    // Setup image load events for skeleton removal
    setupImageLoadHandlers();

    console.log('Services section initialized successfully');
  } catch (error) {
    console.error('Error initializing services section:', error);
  }
}

/**
 * Setup lazy loading for service images
 * Uses native lazy loading with IntersectionObserver fallback
 * @returns {void}
 */
function setupLazyLoading() {
  try {
    const lazyImages = document.querySelectorAll(
      '.service-image img[loading="lazy"]'
    );

    if (lazyImages.length === 0) {
      console.log('No lazy-loading images found in services section');
      return;
    }

    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      console.log(
        `Native lazy loading supported - ${lazyImages.length} images will lazy load`
      );
      // Native lazy loading is already handled by loading="lazy" attribute
      return;
    }

    // Fallback to IntersectionObserver for browsers without native lazy loading
    console.log('Using IntersectionObserver fallback for lazy loading');
    setupIntersectionObserverLazyLoading(lazyImages);
  } catch (error) {
    console.error('Error setting up lazy loading:', error);
  }
}

/**
 * Setup IntersectionObserver-based lazy loading fallback
 * @param {NodeListOf<HTMLImageElement>} images - Images to lazy load
 * @returns {void}
 */
function setupIntersectionObserverLazyLoading(images) {
  try {
    if (!('IntersectionObserver' in window)) {
      console.warn(
        'IntersectionObserver not supported - loading all images immediately'
      );
      images.forEach((img) => loadImage(img));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, observerOptions);

    images.forEach((img) => imageObserver.observe(img));

    console.log(
      `Observing ${images.length} images for lazy loading (IntersectionObserver fallback)`
    );
  } catch (error) {
    console.error('Error setting up IntersectionObserver lazy loading:', error);
  }
}

/**
 * Load an image by setting its src attribute
 * @param {HTMLImageElement} img - Image element to load
 * @returns {void}
 */
function loadImage(img) {
  try {
    if (!img) {
      return;
    }

    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      console.log(`Loaded image: ${src}`);
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

/**
 * Setup image error handling for service images
 * Provides fallback when images fail to load
 * @returns {void}
 */
function setupImageErrorHandling() {
  try {
    const serviceImages = document.querySelectorAll('.service-image img');

    if (serviceImages.length === 0) {
      return;
    }

    serviceImages.forEach((img) => {
      img.addEventListener('error', () => handleImageError(img), {
        once: true
      });
    });

    console.log(
      `Setup error handling for ${serviceImages.length} service images`
    );
  } catch (error) {
    console.error('Error setting up image error handling:', error);
  }
}

/**
 * Handle image load errors with fallback
 * @param {HTMLImageElement} img - Image element that failed to load
 * @returns {void}
 */
function handleImageError(img) {
  try {
    if (!img) {
      return;
    }

    console.warn('Image failed to load:', img.src);

    // Create fallback placeholder
    const container = img.parentElement;
    if (!container) {
      return;
    }

    // Add error state class
    container.classList.add('image-error');

    // Create fallback UI
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', 'Image unavailable');
    fallback.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <p>Image unavailable</p>
    `;

    // Hide broken image and show fallback
    img.style.display = 'none';
    container.appendChild(fallback);

    console.log('Applied fallback for failed image');
  } catch (error) {
    console.error('Error handling image error:', error);
  }
}

/**
 * Setup image load handlers to remove skeleton loading state
 * @returns {void}
 */
function setupImageLoadHandlers() {
  try {
    const serviceImages = document.querySelectorAll('.service-image img');

    if (serviceImages.length === 0) {
      return;
    }

    serviceImages.forEach((img) => {
      // Handle images that are already loaded
      if (img.complete && img.naturalHeight !== 0) {
        handleImageLoaded(img);
      } else {
        // Handle images that will load
        img.addEventListener('load', () => handleImageLoaded(img), {
          once: true
        });
      }
    });

    console.log(`Setup load handlers for ${serviceImages.length} images`);
  } catch (error) {
    console.error('Error setting up image load handlers:', error);
  }
}

/**
 * Handle successful image load
 * @param {HTMLImageElement} img - Image element that loaded successfully
 * @returns {void}
 */
function handleImageLoaded(img) {
  try {
    if (!img) {
      return;
    }

    // Add loaded class to remove skeleton animation
    img.classList.add('loaded');

    // Remove skeleton loading from container
    const container = img.parentElement;
    if (container) {
      container.classList.add('image-loaded');
    }

    console.log('Image loaded successfully:', img.alt || img.src);
  } catch (error) {
    console.error('Error handling image load:', error);
  }
}

/**
 * Preload critical service images
 * Useful for above-the-fold service cards
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise<void>}
 */
export async function preloadServiceImages(imageUrls) {
  try {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.warn('No image URLs provided for preloading');
      return;
    }

    console.log(`Preloading ${imageUrls.length} service images`);

    const preloadPromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Preloaded: ${url}`);
          resolve(url);
        };
        img.onerror = () => {
          console.warn(`Failed to preload: ${url}`);
          reject(new Error(`Failed to preload image: ${url}`));
        };
        img.src = url;
      });
    });

    await Promise.allSettled(preloadPromises);
    console.log('Image preloading complete');
  } catch (error) {
    console.error('Error preloading service images:', error);
  }
}

/**
 * Update service image source
 * Useful for dynamic content updates
 * @param {string} serviceIndex - Index of service card (0-based)
 * @param {string} newImageUrl - New image URL
 * @returns {void}
 */
export function updateServiceImage(serviceIndex, newImageUrl) {
  try {
    if (typeof serviceIndex !== 'number' || serviceIndex < 0) {
      console.error('Invalid service index');
      return;
    }

    if (!newImageUrl || typeof newImageUrl !== 'string') {
      console.error('Invalid image URL');
      return;
    }

    const serviceCards = document.querySelectorAll('.service-card');
    const card = serviceCards[serviceIndex];

    if (!card) {
      console.error(`Service card at index ${serviceIndex} not found`);
      return;
    }

    const img = card.querySelector('.service-image img');
    if (!img) {
      console.error('Image element not found in service card');
      return;
    }

    // Update image source
    img.src = newImageUrl;
    img.classList.remove('loaded');

    console.log(
      `Updated service image at index ${serviceIndex} to ${newImageUrl}`
    );
  } catch (error) {
    console.error('Error updating service image:', error);
  }
}

// Export default initialization function
export default initServices;
