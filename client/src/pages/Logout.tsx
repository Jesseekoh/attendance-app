import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { authClient } from '../lib/auth-client';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { session } = useAuth();

  useEffect(() => {
    const logout = async () => {
      await authClient.signOut({
        fetchOptions: {
          onError: () => {
            console.log('Logout failed');
          },
        },
      });
    };
    logout();
  }, []);
  if (!session) return <Navigate to="/signin" replace />;

  return <div className="text-center mt-10">Logging out...</div>;
};

export default Logout;
