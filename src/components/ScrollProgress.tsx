import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ScrollProgressIndicatorProps {
  className?: string;
  showOnlyWhenScrolling?: boolean;
  hideOnPages?: string[]; // Pages where progress indicator should be hidden
}

export function ScrollProgressIndicator({ 
  className, 
  showOnlyWhenScrolling = false, // Changed default to false for better visibility
  hideOnPages = [] 
}: ScrollProgressIndicatorProps) {
  // All hooks must be called before any early returns
  const { progress, isScrolling } = useScrollProgress();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Hide on specific pages if configured
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }
  
  // Show progress bar when there's meaningful scroll progress
  if (showOnlyWhenScrolling && !isScrolling && progress < 0.02) {
    return null;
  }
  
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-50 transition-opacity duration-300 shadow-sm",
        showOnlyWhenScrolling && !isScrolling && progress > 0.02 && "opacity-70",
        isMobile && "h-0.5", // Thinner on mobile
        className
      )}
      style={{
        transform: `scaleX(${Math.max(progress, 0.001)})`, // Minimum visible width
        transformOrigin: 'left',
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
}

// Floating scroll to top button with enhanced mobile support
interface ScrollToTopButtonProps {
  hideOnPages?: string[]; // Pages where button should be hidden
  showThreshold?: number; // Scroll percentage to show button
}

export function ScrollToTopButton({ 
  hideOnPages = ['/auth'], // Hide on auth page by default
  showThreshold = 0.15 // Show after 15% scroll
}: ScrollToTopButtonProps) {
  // All hooks must be called before any early returns
  const { progress } = useScrollProgress();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Hide on specific pages
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }
  
  // Hide if progress is below threshold
  if (progress < showThreshold) {
    return null;
  }
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group",
        "transform hover:scale-110 active:scale-95 backdrop-blur-sm",
        isMobile ? "w-12 h-12 bottom-4 right-4" : "w-14 h-14 bottom-6 right-6",
        "opacity-0 translate-y-4"
      )}
      style={{
        opacity: progress > showThreshold ? 1 : 0,
        transform: `translateY(${progress > showThreshold ? 0 : 16}px) scale(${progress > showThreshold ? 1 : 0.9})`
      }}
      aria-label="Scroll to top"
    >
      <div className="flex items-center justify-center h-full">
        <svg
          width={isMobile ? "16" : "20"}
          height={isMobile ? "16" : "20"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-y-0.5"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </div>
    </button>
  );
}
