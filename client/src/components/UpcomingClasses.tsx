import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import ClassCard from './ClassCard';
import { ClassInfoType } from './RecentClasses';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
const UpcomingClasses = () => {
  const { user } = useAuth();
  const {
    data: upcomingClasses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['upcomingClasses'],
    queryFn: async () => {
      const response = await api.get(
        `/${user?.role}s/${user?.id}/classes/upcoming`
      );
      return response.data.data;
    },
  });

  if (isError) {
    return <p>An error occurred getting classes</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="pt-2 flex flex-col gap-2">
        {upcomingClasses.length > 0 ? (
          upcomingClasses.map((classInfo: ClassInfoType) => (
            <ClassCard
              classInfo={classInfo}
              key={classInfo.id}
              withFooter={true}
            />
          ))
        ) : (
          <Card>
            <CardContent>
              <p>You have no upcoming classes.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default UpcomingClasses;
