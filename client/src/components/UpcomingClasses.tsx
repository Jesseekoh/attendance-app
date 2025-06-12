import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import ClassCard from './ClassCard';
import { ClassInfoType } from './RecentClasses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
const UpcomingClasses = () => {
  const {
    data: upcomingClasses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['upcomingClasses'],
    queryFn: async () => {
      const response = await api.get('/classes/upcoming');
      console.log(response.data);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Classes
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((classInfo: ClassInfoType) => (
                <ClassCard classInfo={classInfo} key={classInfo.id} />
              ))
            ) : (
              <Card>
                <CardContent>
                  <p>You have no upcoming classes.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UpcomingClasses;
