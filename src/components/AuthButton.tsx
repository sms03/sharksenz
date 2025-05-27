// filepath: d:\GitHub\sharksenz\src\components\AuthButton.tsx.new
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, LogOut, Settings, 
  ChevronDown, UserCircle
} from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserProfile {
  username: string | null;
  full_name: string | null;
  avatar_url?: string | null;
}

const AuthButton = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Cleanup
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Error signing out:", error);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    return session?.user?.email?.[0].toUpperCase() || 'U';
  };

  if (session) {
    return (
      <DropdownMenu>        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 h-auto border border-transparent rounded-xl transition-all duration-300 hover:scale-105",
              "hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 hover:border-blue-200/30 hover:shadow-sm",
              isHovered && "bg-gray-50/80 border-gray-200/50"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar className="h-8 w-8 border-2 border-gray-200/50 ring-2 ring-white shadow-sm">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white text-xs font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate hidden sm:inline font-medium text-gray-700">
              {profile?.username || session.user.email?.split('@')[0]}
            </span>
            <ChevronDown size={14} className={cn(
              "text-gray-500 transition-all duration-300",
              isHovered && "transform rotate-180 text-blue-600"
            )} />
          </Button>
        </DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-xl p-1">
          <div className="px-3 py-3 flex items-center gap-3 border-b border-gray-100">
            <Avatar className="h-10 w-10 border-2 border-gray-200/50">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white text-sm font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {profile?.full_name || profile?.username || "User"}
              </div>
              <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
            </div>
          </div>
            <div className="py-1">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 group">
                <UserCircle className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-gray-900">Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 group">
                <Settings className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors hover:bg-red-50 group text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <Button 
      variant="default" 
      className="font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 rounded-xl"
    >
      <Link to="/auth" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Sign In
      </Link>
    </Button>
  );
};

export default AuthButton;
