import * as React from 'react';
import {
  LayoutDashboard,
  FileChartColumnIncreasing,
  BookTemplate,
  Presentation,
  BookOpenText,
  Home,
  Users,
  BarChart3,
  CheckSquare,
  type LucideIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/config/roles';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  if (user) {
    const { name, email } = user;
    const avatar = user?.image ?? '';
    let navItems: { title: string; icon: LucideIcon; url: string }[];
    switch (user.role) {
      case ROLES.STUDENT:
        navItems = [
          { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
          { title: 'My Courses', icon: BookOpenText, url: '/courses' },
          { title: 'Attendance', icon: BookTemplate, url: '/attendance' },
          { title: 'Report', icon: FileChartColumnIncreasing, url: '/reports' },
        ];
        break;
      case ROLES.TEACHER:
        navItems = [
          { title: 'Dashboard', icon: Home, url: '/dashboard' },
          { title: 'My Courses', icon: BookOpenText, url: '/courses' },
          { title: 'Classes', icon: Presentation, url: '/classes' },
          { title: 'Students', icon: Users, url: '/attendance' },
          { title: 'Attendance', icon: BookTemplate, url: '/attendance' },
          { title: 'Report', icon: BarChart3, url: '/reports' },
        ];
        break;

      default:
        navItems = [];
    }
    return (
      <Sidebar
        collapsible="icon"
        {...props}
        // className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <CheckSquare className="size-6" />
                  </div>
                  <div className="grid flex-1 text-left text-lg leading-tight">
                    <span className="truncate font-bold">CheckIn</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={{ name, email, avatar }} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
  return null;
}
