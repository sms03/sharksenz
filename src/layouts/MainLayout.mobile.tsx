import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Home,
  LucideIcon,
  Presentation,
  User,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/ui/page-transition";
import { gsap } from "gsap";
import MobileNavigation from "@/components/ui/mobile-navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Pitch Simulator",
    href: "/pitch-simulator",
    icon: Presentation,
  },
];

const learningNavItems: NavItem[] = [
  {
    title: "Learning Hub",
    href: "/learning",
    icon: GraduationCap,
  },
];

const infoNavItems: NavItem[] = [
  {
    title: "About Us",
    href: "/about",
    icon: BookOpen,
  },
  {
    title: "Contact Us",
    href: "/contact",
    icon: User,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: BarChart3,
  },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const activeMenuItem = document.querySelector(`a[href="${location.pathname}"]`);

    if (activeMenuItem) {
      gsap.fromTo(
        activeMenuItem,
        { backgroundColor: "rgba(var(--shark-500), 0.2)" },
        {
          backgroundColor: "rgba(var(--shark-500), 0.1)",
          duration: 1,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      const icon = activeMenuItem.querySelector("svg");
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 0.8,
            repeat: 1,
            yoyo: true,
            ease: "back.out(1.7)",
          }
        );
      }
    }

    return () => {
      gsap.killTweensOf(activeMenuItem);
      if (activeMenuItem) {
        const icon = activeMenuItem.querySelector("svg");
        if (icon) {
          gsap.killTweensOf(icon);
        }
      }
    };
  }, [location.pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = () => {
    if (!user) return 'GU';
    if (user.user_metadata?.full_name) {
      const nameParts = user.user_metadata.full_name.split(" ");
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return user.user_metadata.full_name.substring(0, 2).toUpperCase();
    }
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return "US";
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="hidden lg:flex">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SharkSenz Logo" className="h-8 w-8 rounded-md bg-white object-contain" />
              <span className="text-xl font-bold text-shark-500">SharkSenz</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                        <Link to={item.href} className="w-full">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Learning</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {learningNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                        <Link to={item.href} className="w-full">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Information</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {infoNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                        <Link to={item.href} className="w-full">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} SharkSenz
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto scrollbar-shark">          <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-2 sm:px-4 mobile-header">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 hidden lg:flex" variant="outline" />            
              <Link to="/" className="flex items-center gap-2 font-semibold lg:hidden header-logo">
                <div className="overflow-hidden rounded-md bg-white flex items-center justify-center" style={{ width: 'min(36px, 9vw)', height: 'min(36px, 9vw)' }}>
                  <img src="/logo.png" alt="SharkSenz" className="object-contain w-full h-full p-0.5" />
                </div>
                <span className="text-shark-600 font-heading text-base xs:text-lg sm:text-xl mobile-logo-text">SharkSenz</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={handleThemeToggle}
                className="transition-transform hover:rotate-12 header-icon"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full transition-transform hover:scale-110">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || ""} />
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.user_metadata?.full_name || 'Account'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/learning">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          <span>Learning Hub</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild variant="destructive" onClick={handleSignOut}>
                        <Link to="/">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden lg:block">
                  <Button asChild size="sm">
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign in</span>
                    </Link>
                  </Button>
                </div>
              )}
              
              {/* Mobile Navigation */}
              <div className="block lg:hidden">
                <MobileNavigation />
              </div>
            </div>
          </div>
          <PageTransition>
            <div className="p-4 sm:p-6">{children}</div>
          </PageTransition>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
