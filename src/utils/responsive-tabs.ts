// Helper function to detect horizontal scrolling in tabs and show appropriate shadows
export function initializeResponsiveTabs() {
  // Find all scrollable tab containers in the document
  const scrollContainers = document.querySelectorAll('.scrollable-tabs-container');
  
  if (scrollContainers.length === 0) return;
  
  // Set up each container
  scrollContainers.forEach(container => {
    const tabsList = container.querySelector('[role="tablist"]');
    
    if (!tabsList) return;
    
    // Check if scrolling is needed (content wider than container)
    function updateShadows() {
      const { scrollLeft, scrollWidth, clientWidth } = tabsList as HTMLElement;
      const isScrollable = scrollWidth > clientWidth;
      
      // Only show left shadow if scrolled to the right
      const showLeftShadow = scrollLeft > 10;
      // Only show right shadow if more content to the right
      const showRightShadow = scrollLeft + clientWidth + 10 < scrollWidth;

      // Set CSS variables used by the container's ::before and ::after shadows
      container.style.setProperty('--left-shadow-opacity', showLeftShadow ? '1' : '0');
      container.style.setProperty('--right-shadow-opacity', showRightShadow && isScrollable ? '1' : '0');
    }
    
    // Initialize shadows
    updateShadows();
    
    // Update shadows on scroll
    tabsList.addEventListener('scroll', updateShadows);
    
    // Update on window resize
    window.addEventListener('resize', updateShadows);
    
    // Provide keyboard navigation for accessibility
    tabsList.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabsList.querySelectorAll('[role="tab"]'));
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        const activeTab = document.activeElement;
        const activeIndex = tabs.indexOf(activeTab as Element);
        
        if (activeIndex !== -1) {
          const nextIndex = (activeIndex + direction + tabs.length) % tabs.length;
          (tabs[nextIndex] as HTMLElement).focus();
          e.preventDefault();
        }
      }
    });
  });
}

// Initialize tabs when DOM is ready
document.addEventListener('DOMContentLoaded', initializeResponsiveTabs);

// Expose the function for components to use after mount
export function updateTabShadows() {
  const scrollContainers = document.querySelectorAll('.scrollable-tabs-container');
  
  scrollContainers.forEach(container => {
    const tabsList = container.querySelector('[role="tablist"]');
    
    if (!tabsList) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = tabsList as HTMLElement;
    const isScrollable = scrollWidth > clientWidth;
    const showLeftShadow = scrollLeft > 10;
    const showRightShadow = scrollLeft + clientWidth + 10 < scrollWidth;

    container.style.setProperty('--left-shadow-opacity', showLeftShadow ? '1' : '0');
    container.style.setProperty('--right-shadow-opacity', showRightShadow && isScrollable ? '1' : '0');
  });
}
