import {
  User,
  LayoutDashboard,
  FileChartColumnIncreasing,
  BookTemplate,
  LogOut,
  SunMedium,
  ScanQrCode,
  Moon,
} from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import Hamburger from 'hamburger-react';
import { useStore } from '../stores/appStore';

const NavBar = () => {
  const [isOpen, setOpen] = useState(false);
  const { user } = useStore();
  const menuItems = [
    { label: 'Dashboard', component: LayoutDashboard, path: '/dashboard' },
    // { label: 'My Courses', component: BookOpenText, path: '/courses' },
    { label: 'Attendance', component: BookTemplate, path: '/attendance' },
    { label: 'Report', component: FileChartColumnIncreasing, path: '/reports' },
    // { label: 'Classes', component: Presentation, path: '/classes' },
  ];
  return (
    <>
      <nav className="navbar px-4 bg-base-100 shadow-sm justify-between  z-10">
        <div className="navbar-start">
          <div className="drawer flex items-center static w-auto lg:hidden ">
            <div className="z-20 left-4">
              <label
                htmlFor="my-drawer"
                className=" drawer-button cursor-pointer"
              >
                <Hamburger toggled={isOpen} size={30} />
              </label>
            </div>

            <input
              id="my-drawer"
              type="checkbox"
              checked={isOpen}
              onChange={(e) => setOpen(e.target.checked)}
              className="drawer-toggle"
            />
            <div className="drawer-side absolute left-0 z-10">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content pt-20 gap-3  min-h-full w-80 p-4">
                {/* Sidebar content here */}
                {menuItems.map((item) => (
                  <li key={item.path} onClick={() => setOpen(!isOpen)}>
                    <Link
                      to={item.path}
                      className="active:!bg-neutral/30 active:text-neutral-content"
                    >
                      <item.component />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-auto">
                  <Link
                    to="/logout"
                    className="active:!bg-neutral/30 active:text-neutral-content"
                  >
                    <LogOut />
                    <span>Log Out</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link to={'/'} className="font-[Inter] text-xl font-extrabold flex">
            {/* <SquareCheckBig /> */}
            <span>CheckIn</span>
          </Link>
        </div>
        {/* <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div> */}
        <div className="navbar-end gap-2">
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" className="theme-controller" value="light" />
            <SunMedium
              className="swap-on w-8 h-8 fill-yellow-300"
              absoluteStrokeWidth
            />

            <Moon className="swap-off h-7 w-7 fill-white" absoluteStrokeWidth />
          </label>
          <label className="btn btn-square btn-ghost">
            <ScanQrCode size={32} strokeWidth={1.75} absoluteStrokeWidth />
          </label>

          {user && (
            <div className="flex items-center gap-2">
              <Link to={'/my-profile'} className="avatar">
                <div className="!flex items-center ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                  <User size={20} className="mx-auto" />
                </div>
              </Link>
              {/* <span>{user?.firstName}</span> */}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
