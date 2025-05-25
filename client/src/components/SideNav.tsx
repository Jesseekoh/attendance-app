import { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, LogOut, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { NavLink, Link } from 'react-router';

export type MenuItem = {
  label: string;
  component: React.FC<{ className?: string }>;
  path: string;
};
const SideNav = ({
  onToggle,
  menuItems,
}: {
  onToggle: (isExpanded: boolean) => void;
  menuItems: MenuItem[];
}) => {
  const sideNavRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: Fix rendering error caused by bad setstate
  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      onToggle(newState);
      return newState;
    });
  };

  return (
    <aside
      className={clsx(
        'min-h-screen h-dvh top-0 bottom-0 left-0 hidden lg:block bg-accent transition-all sticky z-10 rounded-e-md overflow-y-auto overflow-x-hidden',
        isExpanded ? 'w-[200px]' : 'w-[64px]'
      )}
      ref={sideNavRef}
    >
      <nav className="h-full flex relative">
        <ul className="h-full w-full flex flex-col  px-2 pt-5 pb-2 gap-3">
          <Link
            to={'/'}
            className="font-[Inter] text-xl font-extrabold flex text-base-content gap-2"
          >
            <CheckCheck className="shrink-0" />
            <span
              className={clsx(
                'transition-all origin-left whitespace-nowrap',
                isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              )}
            >
              CheckIn
            </span>
          </Link>
          <button type="button" className="w-max" onClick={toggleSidebar}>
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
          {menuItems.map((item) => (
            <li key={item.path} className="">
              <NavLink
                to={item.path}
                className={clsx('px-2 py-2 flex w-full items-center gap-2')}
              >
                <item.component className="shrink-0" />

                {
                  <span
                    className={clsx(
                      'transition-all origin-left whitespace-nowrap',
                      isExpanded
                        ? 'opacity-100 scale-100 relative'
                        : 'opacity-0 scale-0 '
                    )}
                  >
                    {item.label}
                  </span>
                }
              </NavLink>
            </li>
          ))}
          <li className="mt-auto">
            <Link
              to="/logout"
              className="px-2 py-2 flex items-center gap-2 active:!bg-neutral/30 active:text-neutral-content"
            >
              <LogOut className="shrink-0" />
              {
                <span
                  className={clsx(
                    'transition-all origin-left whitespace-nowrap',
                    isExpanded
                      ? 'opacity-100 scale-100 relative'
                      : 'opacity-0 scale-0 absolute left-[24px]'
                  )}
                >
                  Log Out
                </span>
              }
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;
