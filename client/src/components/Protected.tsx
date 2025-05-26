import { Navigate, useLocation, useNavigate } from 'react-router';
import { useStore } from '../stores/appStore';
import { useEffect } from 'react';
import { Role } from '../config/roles';
const Protected = ({
  children,
  allowedRoles,
}: Readonly<{ children: React.ReactNode; allowedRoles: Role[] }>) => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate('/signin', { replace: true });
  }, [user, navigate]);

  const isAuthenticated = user?.role
    ? allowedRoles.includes(user?.role)
    : false;

  if (!isAuthenticated) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default Protected;
