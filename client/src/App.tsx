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
// import Courses from './pages/Courses';
import { useStore } from './stores/appStore';
import ClassDetails from './pages/ClassDetails';
import Logout from './pages/Logout';
import Error from './pages/Error';
import { classDetailsLoader } from './loaders';
import { useEffect, useState } from 'react';

function App() {
  const { user, fetchUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      await fetchUser();
      setIsLoading(false);
    };
    initializeUser();
  }, [fetchUser]);

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen w-full flex justify-center">
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
            <Protected>
              <Dashboard />
            </Protected>
          ),
        },
        // {
        //   path: '/courses',
        //   element: (
        //     <Protected>
        //       <Courses />
        //     </Protected>
        //   ),
        // },
        {
          path: '/classes/:classId',
          loader: classDetailsLoader,
          errorElement: <Error />,
          element: (
            <Protected>
              <ClassDetails />
            </Protected>
          ),
        },
        {
          path: '/my-profile',
          element: (
            <Protected>
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
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
