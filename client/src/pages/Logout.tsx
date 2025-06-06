import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { authClient } from '../lib/auth-client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
const Logout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    console.log('bulaba');
    const logout = async () => {
      await authClient.signOut({
        fetchOptions: {
          onError: () => {
            toast.error('Log out attempt failed');
            navigate('/', { replace: true });
          },
          onSuccess: () => {
            toast.success('Logged out successful');
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
