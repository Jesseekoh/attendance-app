import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent } from '@/components/ui/card';
import ClassCard from '@/components/ClassCard.tsx';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { ClassInfoType } from '@/components/RecentClasses.tsx';

export default function OngoingClasses() {
  const {
    data: ongoingClasses,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['onGoing-classes'],
    queryFn: async () => {
      const resp = await api.get('/classes/ongoing');
      return resp.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full"></div>
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full"></div>
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-red-500/80">
        <CardContent>
          <p className="text-red-200">Error Fetching ongoing classes</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="pt-2 flex flex-col gap-2">
      {ongoingClasses.length > 0 ? (
        ongoingClasses.map((classInfo: ClassInfoType) => (
          <ClassCard classInfo={classInfo} key={classInfo.id} />
        ))
      ) : (
        <p>You have no ongoing classes...</p>
      )}
      {ongoingClasses.totalClasses >= 5 && (
        <Link className="self-end" to="/attendance">
          <Button className={cn('w-full md:w-auto ')}>View More</Button>
        </Link>
      )}
    </div>
  );
}
