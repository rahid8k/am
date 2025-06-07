document.addEventListener('DOMContentLoaded', function() {
    // Select all sections that need animations
    const contentSections = document.querySelectorAll(
        '.content-block-wrapper.grid-item, ' +
        '#feature-section-1 .content-block-wrapper, ' + 
        '#feature-section-2 .content-block-wrapper, ' +
        '.site-card h3, ' +
        '.content-block-wrapper, ' +
        '.detail-image'
    );
    
    // Select all images for scroll-based zoom effects
    const parallaxImages = document.querySelectorAll('.parallax-image, .background-image, .site-image img, .detail-image');
    
    // Track elements that have been animated
    const animatedElements = new Map();
    
    // Set up all content sections
    contentSections.forEach(section => {
        section.classList.add('animate-section');
        animatedElements.set(section, false);
    });
    
    // Function to check if an element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && 
            rect.bottom >= 0
        );
    }
    
    // Function to check if element is completely out of viewport
    function isElementCompletelyOutOfViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.bottom < 0 || 
            rect.top > (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    
    // Function to calculate scroll progress through an element with center-focus
    function getScrollProgress(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If element is not in view at all
        if (rect.bottom <= 0 || rect.top >= windowHeight) {
            return 0;
        }
        
        // Calculate center points
        const elementCenter = rect.top + (rect.height / 2);
        const viewportCenter = windowHeight / 2;
        
        // CUSTOMIZABLE: Maximum zoom factor (1.0 = no zoom, 1.2 = 20% zoom)
        const MAX_ZOOM = 1.2;
        
        // CUSTOMIZABLE: How quickly zoom changes (higher = more responsive to scroll)
        const ZOOM_INTENSITY = 1.5;
        
        // Calculate distance from center (0 = centered, 1 = at edge)
        // This creates a bell curve where zoom is highest when element is centered
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter) / (windowHeight / 2);
        
        // Normalize to 0-1 range where 1 is maximum zoom (at center)
        const normalizedProgress = 1 - Math.min(1, distanceFromCenter * ZOOM_INTENSITY);
        
        return normalizedProgress;
    }
    
    // Function to apply zoom based on scroll position
    function applyScrollZoom() {
        parallaxImages.forEach(image => {
            const section = image.closest('.full-viewport') || image.closest('.site-card');
            if (section) {
                const progress = getScrollProgress(section);
                
                // CUSTOMIZABLE: Base zoom level (1.0 = no zoom)
                const BASE_ZOOM = 1.0;
                
                // CUSTOMIZABLE: Additional zoom factor (0.2 = up to 20% larger)
                const ZOOM_FACTOR = 0.1;
                
                // Calculate scale: maximum when centered in viewport
                const scale = BASE_ZOOM + (ZOOM_FACTOR * progress);
                
                // Apply scaling
                image.style.transform = `scale(${scale})`;
                
                // DEBUG: Uncomment to visualize zoom intensity
                // console.log(`Section: ${section.id}, Progress: ${progress.toFixed(2)}, Scale: ${scale.toFixed(2)}`);
            }
        });
    }
    
    // Function to handle scroll animations
    function handleScrollAnimation() {
        // Apply blur/transform animations for content sections
        contentSections.forEach(section => {
            const isInView = isElementInViewport(section);
            const wasAnimated = animatedElements.get(section);
            
            if (isInView && !wasAnimated) {
                section.classList.add('animated');
                animatedElements.set(section, true);
            } 
            else if (isElementCompletelyOutOfViewport(section) && wasAnimated) {
                section.classList.remove('animated');
                animatedElements.set(section, false);
            }
        });
        
        // Apply zoom effects based on scroll position
        applyScrollZoom();
    }
    
    // Run once to set initial states
    handleScrollAnimation();
    
    // Add scroll event listener with requestAnimationFrame for performance
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScrollAnimation);
    });
    
    // Also handle on resize
    window.addEventListener('resize', handleScrollAnimation);
});

document.addEventListener('DOMContentLoaded', function() {
  var img = document.getElementById('sense-of-place-map');
  if (!img) return;

  function isMobile() {
    return window.innerWidth <= 640;
  }

  img.addEventListener('click', function handler(e) {
    if (!isMobile()) return;

    // Toggle zoom
    if (!img.classList.contains('zoomed-mobile')) {
      img.classList.add('zoomed-mobile');
      img.style.zIndex = 9999;

      // Prevent horizontal touchmove while zoomed
      function preventHorizontal(e) {
        if (e.touches && e.touches.length === 1) {
          // Only allow vertical movement
          if (Math.abs(e.touches[0].clientX - e.touches[0].screenX) > 0) {
            e.preventDefault();
          }
        }
      }
      img.addEventListener('touchmove', preventHorizontal, { passive: false });

      // Add a one-time event to close zoom
      img.addEventListener('click', function closeZoom() {
        img.classList.remove('zoomed-mobile');
        img.style.zIndex = '';
        img.removeEventListener('touchmove', preventHorizontal);
        img.removeEventListener('click', closeZoom);
      }, { once: true });
    }
  });
});