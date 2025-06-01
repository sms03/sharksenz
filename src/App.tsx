
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContentLibrary from "./pages/ContentLibrary";
import ContentDetail from "./pages/ContentDetail";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MarketTrends from "./pages/MarketTrends";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import gsap from "gsap";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Register GSAP plugins
gsap.registerPlugin();

const queryClient = new QueryClient();

const App = () => {
  // Global page transition animation
  useEffect(() => {
    gsap.to("body", { opacity: 1, duration: 0.5, ease: "power1.out" });
  }, []);  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route 
                path="/content" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <ContentLibrary />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />
              <Route 
                path="/content/:contentId" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <ContentDetail />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />              <Route 
                path="/profile" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />              <Route 
                path="/analytics" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <AnalyticsDashboard />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />
              <Route 
                path="/market-trends" 
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <MarketTrends />
                    </ProtectedRoute>
                  </MainLayout>
                } 
              />
              <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
              <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
              <Route path="/auth" element={<Auth />} />
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
              <Route path="/terms-of-service" element={<MainLayout><TermsOfService /></MainLayout>} />
              <Route path="/cookies" element={<MainLayout><CookiePolicy /></MainLayout>} />
              <Route path="/disclaimer" element={<MainLayout><Disclaimer /></MainLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}              
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
