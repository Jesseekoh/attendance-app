import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Skeleton } from './ui/skeleton';
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

type GreetingBannerApiResponseType = { attended: boolean }[];

export default function GreetingBanner() {
  const { user } = useAuth();
  const today = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-classes-today', user?.id],
    queryFn: async (): Promise<GreetingBannerApiResponseType> => {
      const resp = await api.get(`/${user?.role}s/${user?.id}/classes/today`, {
        params: {
          date: today.toISOString().slice(0, 10),
          timezone,
        },
      });
      return resp.data.data;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-lg" />;
  }

  if (isError) {
    return <h1>Error loading greeting banner</h1>;
  }

  const todayClassesCount = data?.length;
  const todayAttended = data?.filter((c) => c.attended === true).length;
  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
      <h1 className="text-2xl font-bold">
        {getGreeting()}, {user?.name}
      </h1>

      {todayClassesCount === 0 ? (
        'You have no classes today'
      ) : (
        <p className="text-blue-100 mt-1">
          You have {todayClassesCount} classes scheduled for today.{' '}
          {todayAttended} attendance sessions completed.
        </p>
      )}
    </div>
  );
}
