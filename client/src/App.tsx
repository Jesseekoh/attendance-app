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
import { UserType, useStore } from './stores/appStore';
import ClassDetails from './pages/ClassDetails';
import Logout from './pages/Logout';
import Error from './pages/Error';
import { classDetailsLoader } from './loaders';
import { useEffect, useState } from 'react';
import Attendance from './pages/Attendance';
import { ROLES } from './config/roles';

function App() {
  const { user, fetchUser, updateUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeUser = async () => {
      // if (window.location.pathname === '/logout') {
      //   setIsLoading(false);
      //   return;
      // }
      const userData = (await fetchUser()) as UserType;
      updateUser(userData);
      setIsLoading(false);
    };
    initializeUser();
  }, [fetchUser, updateUser]);

  if (isLoading) {
    return (
      <div className="min-h-svh w-full flex justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  const router = createBrowserRouter([
    {
      // element: <RootLayout />,
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
          path: '/attendance',
          element: (
            <Protected allowedRoles={[ROLES.STUDENT]}>
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
