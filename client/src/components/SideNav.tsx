import { useRef, useState } from 'react';
import { ChevronsRight, ChevronsLeft, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { NavLink, Link } from 'react-router';

export type MenuItem = {
  label: string;
  component: React.FC<{ className?: string }>;
  path: string;
};
const SideNav = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const sideNavRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: Fix rendering error caused by bad setstate
  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  return (
    <aside
      className={clsx(
        'h-dvh top-0 bottom-0 left-0 hidden lg:block bg-base-300 transition-all sticky z-10 rounded-e-md overflow-y-auto shrink-0 overflow-x-hidden',
        isExpanded ? 'w-[200px]' : 'w-[64px]'
      )}
      ref={sideNavRef}
    >
      <nav className="h-full w-full">
        <ul className="h-full w-full menu  pt-5 pb-2 gap-3">
          <div className="flex gap-2 w-full justify-between items-center">
            {isExpanded && (
              <Link
                to={'/'}
                className={clsx(
                  'transition-all origin-right whitespace-nowrap font-[Inter] text-xl font-extrabold flex text-base-content gap-2',
                  isExpanded
                    ? 'opacity-100 scale-100 ml-3'
                    : 'opacity-0 scale-0'
                )}
              >
                CheckIn
              </Link>
            )}
            <button
              type="button"
              className="w-max px-3 py-1.5"
              onClick={toggleSidebar}
            >
              {isExpanded ? <ChevronsLeft /> : <ChevronsRight />}
            </button>
          </div>

          {menuItems.map((item) => (
            <li
              key={item.path}
              className="w-full"
              data-tooltip-id="my-tooltip"
              data-tooltip-content={item.label}
            >
              <NavLink
                to={item.path}
                className={clsx('flex w-full items-center mx-auto')}
              >
                <item.component className="shrink-0" />
                {
                  <span
                    className={clsx(
                      'transition-all origin-left whitespace-nowrap',
                      isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    )}
                  >
                    {item.label}
                  </span>
                }
              </NavLink>
            </li>
          ))}
          <li className="mt-auto w-full">
            <Link
              to="/logout"
              className="flex w-full items-center mx-auto active:!bg-neutral/30 active:text-neutral-content"
            >
              <LogOut className="shrink-0" />
              {isExpanded && (
                <span
                  className={clsx(
                    'transition-all origin-left whitespace-nowrap',
                    isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  )}
                >
                  Log Out
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;
