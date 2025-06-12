import { ROLES } from '../config/roles';
import StudentDashboard from '../components/StudentDashboard';
import AdminDashboard from '../components/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
const Dashboard = () => {
  const { user } = useAuth();

  // authClient.
  if (user?.role === ROLES.STUDENT) {
    return <StudentDashboard />;
  }
  if (user?.role === ROLES.ADMIN) {
    return <AdminDashboard />;
  }

  if (user?.role === ROLES.TEACHER) {
    return <TeacherDashboard />;
  }

  return <Navigate to="/unauthorized" />;
};

export default Dashboard;
