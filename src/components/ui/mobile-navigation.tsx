import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3, 
  GraduationCap,
  BookOpen,
  User,
  Presentation, 
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "./button";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ href, icon: Icon, label, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
        isActive 
          ? "bg-shark-500/10 text-shark-600 dark:text-shark-400" 
          : "hover:bg-shark-500/5 text-gray-600 dark:text-gray-400"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleSignOut = async () => {
    closeMenu();
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  
  return (
    <>      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md hover:bg-shark-500/5 header-icon"
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeMenu}
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-900 z-50 shadow-xl flex flex-col"            >              <div className="flex items-center justify-between p-4 border-b mobile-header">
                <div className="flex items-center gap-2 header-logo">
                  <div className="overflow-hidden rounded-md bg-white flex items-center justify-center" style={{ width: 'min(32px, 8vw)', height: 'min(32px, 8vw)' }}>
                    <img src="/logo.png" alt="SharkSenz Logo" className="object-contain w-full h-full p-0.5" />
                  </div>
                  <span className="text-lg font-semibold text-shark-500 mobile-logo-text">SharkSenz</span>
                </div>
                <button
                  onClick={closeMenu}                  className="p-2 rounded-md hover:bg-shark-500/5 header-icon"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1 mb-4">
                  <h3 className="px-4 py-1 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    Main
                  </h3>
                  <NavItem href="/" icon={Home} label="Home" onClick={closeMenu} />
                  <NavItem href="/dashboard" icon={BarChart3} label="Dashboard" onClick={closeMenu} />
                  <NavItem href="/pitch-simulator" icon={Presentation} label="Pitch Simulator" onClick={closeMenu} />
                </div>
                
                <div className="space-y-1 mb-4">
                  <h3 className="px-4 py-1 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    Learning
                  </h3>
                  <NavItem href="/learning" icon={GraduationCap} label="Learning Hub" onClick={closeMenu} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="px-4 py-1 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    Information
                  </h3>
                  <NavItem href="/about" icon={BookOpen} label="About Us" onClick={closeMenu} />
                  <NavItem href="/contact" icon={User} label="Contact Us" onClick={closeMenu} />
                  <NavItem href="/pricing" icon={BarChart3} label="Pricing" onClick={closeMenu} />
                </div>
              </div>
              
              <div className="p-4 border-t">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.user_metadata?.full_name || "User"}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button asChild className="w-full" onClick={closeMenu}>
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
