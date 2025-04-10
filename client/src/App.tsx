import './App.css';
import { Navigate, Route, Routes } from 'react-router';
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

function App() {
  const { user } = useStore();
  return (
    <>
      <Routes>
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
      </Routes>
    </>
  );
}

export default App;
