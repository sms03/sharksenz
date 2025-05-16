import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Auth callback page that handles OAuth redirects
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the code and state from the URL
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
  
      if (params.get('error')) {
        toast.error(`Authentication error: ${params.get('error_description') || params.get('error')}`);
        navigate('/auth');
        return;
      }

      // The session will be automatically saved by the Supabase client
      // Just need to navigate back to the app
      toast.success('Successfully logged in!');
      navigate('/');
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold">Logging you in...</h1>
        <p>You'll be redirected shortly.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
