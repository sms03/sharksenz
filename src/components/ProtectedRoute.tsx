import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show toast notification when redirecting unauthenticated users
    if (!isLoading && !user) {
      toast.info("Authentication Required", {
        description: "Please sign in or sign up to access this content.",
        duration: 5000,
      });
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-muted-foreground">Checking authentication status...</p>
      </div>
    );
  }

  if (!user) {
    // Show a brief message before redirecting
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-md text-center p-8 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-blue-100 dark:border-blue-900">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Protected Content</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in or create an account to access this content.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </div>
        <Navigate to={`/auth?returnUrl=${encodeURIComponent(location.pathname)}`} replace />
      </div>
    );
  }

  return <>{children}</>;
};
