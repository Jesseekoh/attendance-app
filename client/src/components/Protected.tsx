import { Navigate, useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Role } from '../config/roles';
import { useAuth } from '../contexts/AuthContext';
const Protected = ({
  children,
  allowedRoles,
}: Readonly<{ children: React.ReactNode; allowedRoles: Role[] }>) => {
  const data = useAuth();
  const user = data.user;
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate('/signin', { replace: true });
  }, []);

  if (!user) return <Navigate to="/signin" replace />;
  const isAuthenticated = user?.role
    ? allowedRoles.includes(user?.role)
    : false;

  if (!isAuthenticated) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default Protected;
