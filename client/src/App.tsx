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
import Courses from './pages/Courses';
import { useStore } from './stores/appStore';
import ClassDetails from './pages/ClassDetails';
import Logout from './pages/Logout';
import Error from './pages/Error';
import { classDetailsLoader, logOutLoader } from './loaders';

function App() {
  const { user } = useStore();
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: user ? <Navigate to="/dashboard" /> : <Home />,
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
        {
          path: '/courses',
          element: (
            <Protected>
              <Courses />
            </Protected>
          ),
        },
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
      loader: logOutLoader,
    },
  ]);
  return (
    <>
      {/* <Routes>
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route element={<RootLayout />}>
          <Route
            index
            element={user ? <Navigate to="/dashboard" /> : <Home />}
          />
        </Route>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/courses"
            element={
              <Protected>
                <Courses />
              </Protected>
            }
          />
          <Route path="/classes/:classId" element={<ClassDetails />} />
          <Route
            path="/my-profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
        </Route>
        <Route
          path="/signup"
          element={user ? <Navigate to={'/dashboard'} replace /> : <SignUp />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to={'/dashboard'} replace /> : <SignIn />}
        />
        <Route
          path="/logout"
          loader={async () => {
            const response = await api.post('/auth/logout');
            return response.data;
          }}
          element={<Logout />}
        />
      </Routes> */}
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
