import { Link, Outlet } from 'react-router';
import { SquareCheckBig } from 'lucide-react';
import { useStore } from '../stores/appStore';
// import { useAuth } from '../hooks/useAuth';
export const RootLayout = () => {
  const { user } = useStore();
  return (
    <>
      <header>
        <div className="container flex justify-between h-16 items-center px-4 mx-auto">
          <Link to={'/'} className="font-[Inter] text-xl font-extrabold flex">
            <SquareCheckBig />
            <span>CheckIn</span>
          </Link>
          <div className="flex gap-6 items-center">
            {user ? (
              <h1>{user.firstName}</h1>
            ) : (
              <Link to={'/signup'}>
                <button className="px-4 py-2 rounded-lg text-white text-lg bg-emerald-400 ">
                  Sign up
                </button>
              </Link>
            )}
            {/* <Link to={'/signin'}>
              <button className="text-lg">Sign in</button>
            </Link> */}
          </div>
        </div>
      </header>
      <Outlet />

      <footer className="mt-auto text-neutral-500 text-center">
        <p>
          © 2025 Checkin - Made with ❤️ -{' '}
          <Link to={'https://github.com/jesseekoh'}>Jesseekoh</Link>
        </p>
      </footer>
    </>
  );
};

export default RootLayout;
