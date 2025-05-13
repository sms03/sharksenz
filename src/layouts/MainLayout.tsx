import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Home,
  LucideIcon,
  Presentation,
  Trophy,
  User,
  LogIn,
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
  {
    title: "Achievements",
    href: "/achievements",
    icon: Trophy,
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

  const handleLogout = async () => {
    try {
      gsap.to("body", {
        opacity: 0.7,
        duration: 0.3,
        onComplete: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          toast.success("Logged out successfully");
          gsap.to("body", { opacity: 1, duration: 0.3 });
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
      gsap.to("body", { opacity: 1, duration: 0.3 });
    }
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  const handleThemeToggle = () => {
    const targetTheme = theme === "dark" ? "light" : "dark";

    gsap.to("body", {
      backgroundColor: targetTheme === "dark" ? "#121212" : "#ffffff",
      color: targetTheme === "dark" ? "#ffffff" : "#121212",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => setTheme(targetTheme),
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
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
        <div className="flex-1 overflow-auto scrollbar-shark">
          <div className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" variant="outline" />
            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={handleThemeToggle}
                className="transition-transform hover:rotate-12"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full transition-transform hover:scale-110">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.email || ""} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
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
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" size="sm" className="transition-transform hover:scale-105">
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <PageTransition>
            <div className="p-6">{children}</div>
          </PageTransition>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
