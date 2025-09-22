'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavLink to={item.url} onClick={handleLinkClick}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        isActive &&
                          ' not-dark:!text-primary-foreground not-dark:bg-gradient-to-tr from-gray-800 to-neutral-700',
                        'py-5'
                      )}
                    >
                      <div>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarMenu>
    </SidebarGroup>
  );
}
