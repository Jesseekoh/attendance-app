import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { lazy, Suspense } from 'react';
import RootLayout from './layout/RootLayout';
import AppLayout from './layout/AppLayout';
import Protected from './components/Protected';
import { classDetailsLoader } from './loaders';
import { ROLES } from './config/roles';
import { useAuth } from './contexts/AuthContext';
import Spinner from './components/Spinner';

const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClassDetails = lazy(() => import('./pages/ClassDetails'));
const Logout = lazy(() => import('./pages/Logout'));
const Error = lazy(() => import('./pages/Error'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Courses = lazy(() => import('./pages/Courses'));
const TeacherClasses = lazy(() => import('./pages/TeacherClasses'));
const StudentsList = lazy(() => import('./components/StudentsList'));
const ClassAttendanceRecord = lazy(
  () => import('./pages/ClassAttendanceRecord')
);

const PageLoader = () => {
  return (
    <div className="min-h-svh w-full grid place-items-center">
      <Spinner />
    </div>
  );
};

const LazyRoute = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};
function App() {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      index: true,
      element: <Navigate to={user ? '/dashboard' : '/home'} replace />,
      errorElement: (
        <LazyRoute>
          <Error />
        </LazyRoute>
      ),
    },
    {
      path: '/home',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <LazyRoute>
              <Home />
            </LazyRoute>
          ),
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
              <LazyRoute>
                <Dashboard />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/forbidden',
          element: <h1 className="text-4xl text-center">403, Forbidden</h1>,
        },
        {
          path: '/courses',
          element: (
            <Protected
              allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN]}
            >
              <LazyRoute>
                <Courses />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/students',
          element: (
            <Protected allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <LazyRoute>
                <StudentsList />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/attendance',
          element: (
            <Protected
              allowedRoles={[ROLES.STUDENT, ROLES.ADMIN, ROLES.TEACHER]}
            >
              <LazyRoute>
                <Attendance />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/classes',
          element: (
            <Protected allowedRoles={[ROLES.TEACHER]}>
              <LazyRoute>
                <TeacherClasses />
              </LazyRoute>
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
              <LazyRoute>
                <ClassDetails />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/classes/:classId/attendance',
          element: (
            <Protected allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <LazyRoute>
                <ClassAttendanceRecord />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '/my-profile',
          element: (
            <Protected
              allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}
            >
              <LazyRoute>
                <Profile />
              </LazyRoute>
            </Protected>
          ),
        },
        {
          path: '*',
          element: <h1>Not found</h1>,
        },
      ],
      errorElement: (
        <LazyRoute>
          <Error />
        </LazyRoute>
      ),
    },
    {
      path: '/signup',
      element: user ? (
        <Navigate to={'/dashboard'} replace />
      ) : (
        <LazyRoute>
          <SignUp />
        </LazyRoute>
      ),
    },
    {
      path: '/signin',
      element: user ? (
        <Navigate to={'/dashboard'} replace />
      ) : (
        <LazyRoute>
          <SignIn />
        </LazyRoute>
      ),
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
