import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { api } from '../api/axiosClient';
import { useStore } from '../stores/appStore';

const Logout = () => {
  const { updateUser } = useStore();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  useEffect(() => {
    const logout = async () => {
      try {
        await api.post('/auth/logout');
        updateUser(null);
        setIsLoggedOut(true);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    logout();
  }, [updateUser]);

  if (isLoggedOut) {
    return <Navigate to="/signin" />;
  }
  return <div className="text-center mt-10">Logging out...</div>;
};

export default Logout;
