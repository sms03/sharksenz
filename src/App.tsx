
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
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import gsap from "gsap";

// Register GSAP plugins
gsap.registerPlugin();

const queryClient = new QueryClient();

const App = () => {
  // Global page transition animation
  useEffect(() => {
    gsap.to("body", { opacity: 1, duration: 0.5, ease: "power1.out" });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/content" element={<MainLayout><ContentLibrary /></MainLayout>} />
            <Route path="/content/:contentId" element={<MainLayout><ContentDetail /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/analytics" element={<MainLayout><AnalyticsDashboard /></MainLayout>} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
