/**
 * Mobile Viewport Height Fix
 *
 * This utility addresses the issue with viewport height (vh) units on mobile browsers.
 * Mobile browsers often have dynamic address/navigation bars that change the viewport height,
 * causing layout issues with vh-based heights.
 *
 * Usage:
 * - Import and call initializeViewportFix() in your main App component
 * - Use the CSS variable --vh in your styles instead of vh units
 *   Example: height: calc(var(--vh, 1vh) * 100);
 */

export const initializeViewportFix = () => {
  // Initial calculation
  updateViewportHeight();
  
  // Update on resize
  window.addEventListener('resize', updateViewportHeight);
  
  // Update on orientation change (especially important for mobile)
  window.addEventListener('orientationchange', updateViewportHeight);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', updateViewportHeight);
    window.removeEventListener('orientationchange', updateViewportHeight);
  };
};

// Calculate and set the --vh CSS variable
const updateViewportHeight = () => {
  // Get the viewport height and multiply by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  
  // Set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
