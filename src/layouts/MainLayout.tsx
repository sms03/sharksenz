
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollProgressIndicator, ScrollToTopButton } from "@/components/ScrollProgress";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  // Pages where scroll progress should behave differently
  const hideScrollProgressPages = ['/payment/success'];
  const hideScrollToTopPages = ['/auth', '/payment/success'];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Scroll Progress Indicator */}
      <ScrollProgressIndicator 
        hideOnPages={hideScrollProgressPages}
        showOnlyWhenScrolling={false} // Always show for better UX
      />
      
      {/* Global Scroll to Top Button */}
      <ScrollToTopButton 
        hideOnPages={hideScrollToTopPages}
        showThreshold={0.15} // Show after 15% scroll
      />
      
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
