import { Navigate, useLocation, useNavigate } from 'react-router';
import { useStore } from '../stores/appStore';
import { useEffect } from 'react';
const Protected = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user)
      navigate('/signin', { replace: true, state: { from: location } });
  }, [user, navigate]);

  return user ? children : <Navigate to="/signin" state={{ from: location }} />;
};

export default Protected;
