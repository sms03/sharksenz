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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, LogOut, UserCircle, Settings, 
  FileText, Bell, ChevronDown, Shield
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center gap-2 px-3 py-2 h-auto border border-transparent rounded-lg transition-all duration-200",
              isHovered && "bg-gray-100/80 border-gray-200/80"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-blue-600 text-white text-xs font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate hidden sm:inline font-medium">
              {profile?.username || session.user.email?.split('@')[0]}
            </span>
            <ChevronDown size={14} className={cn(
              "transition-transform duration-200",
              isHovered && "transform rotate-180"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-2.5 flex flex-col">
            <div className="font-medium">{profile?.full_name || profile?.username}</div>
            <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/content" className="flex items-center cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              My Content
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
            <LogOut size={16} className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant="default" 
      className="font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow"
    >
      <Link to="/auth" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Sign In
      </Link>
    </Button>
  );
};

export default AuthButton;
