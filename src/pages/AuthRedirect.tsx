import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This component handles redirections from OAuth providers
 * It's a simple component that extracts the hash fragment from the URL
 * and passes it to the callback handler
 */
const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Pass the hash fragment to the callback handler
    window.location.href = '/auth/callback' + window.location.hash;
  }, [navigate]);

  return null;
};

export default AuthRedirect;
