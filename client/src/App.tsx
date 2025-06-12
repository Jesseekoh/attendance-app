import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import RootLayout from './layout/RootLayout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Protected from './components/Protected';
import Profile from './pages/Profile';
import AppLayout from './layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ClassDetails from './pages/ClassDetails';
import Logout from './pages/Logout';
import Error from './pages/Error';
import { classDetailsLoader } from './loaders';
import Attendance from './pages/Attendance';
import { ROLES } from './config/roles';
import { useAuth } from './contexts/AuthContext';
import Courses from './pages/Courses';

function App() {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      index: true,
      element: <Navigate to={user ? '/dashboard' : '/home'} replace />,
      errorElement: <Error />,
    },
    {
      path: '/home',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: '/dashboard',
          element: (
            <Protected
              allowedRoles={[ROLES.STUDENT, ROLES.ADMIN, ROLES.TEACHER]}
            >
              <Dashboard />
            </Protected>
          ),
        },
        {
          path: '/forbidden',
          element: <h1>Forbidden bruh</h1>,
        },
        {
          path: '/courses',
          element: (
            <Protected
              allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN]}
            >
              <Courses />
            </Protected>
          ),
        },
        {
          path: '/attendance',
          element: (
            <Protected
              allowedRoles={[ROLES.STUDENT, ROLES.ADMIN, ROLES.TEACHER]}
            >
              <Attendance />
            </Protected>
          ),
        },
        {
          path: '/classes/:classId',
          loader: classDetailsLoader,
          errorElement: <Error />,
          element: (
            <Protected
              allowedRoles={[ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER]}
            >
              <ClassDetails />
            </Protected>
          ),
        },
        {
          path: '/my-profile',
          element: (
            <Protected
              allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}
            >
              <Profile />
            </Protected>
          ),
        },
        {
          path: '*',
          element: <h1>Not found</h1>,
        },
      ],
      errorElement: <Error />,
    },
    {
      path: '/signup',
      element: user ? <Navigate to={'/dashboard'} replace /> : <SignUp />,
    },
    {
      path: '/signin',
      element: user ? <Navigate to={'/dashboard'} replace /> : <SignIn />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
