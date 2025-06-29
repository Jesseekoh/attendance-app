import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
const AppLayout = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" />;

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
