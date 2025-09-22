import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import ClassCard from './ClassCard';
import { Link } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useAuth } from '@/contexts/AuthContext';

export interface ClassInfoType {
  id: string;
  startTime: string;
  endTime: string;
  venue: Venue;
  teacher: Teacher;
  course: Course;
  attended?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}

export interface Teacher {
  id: string;
  department: string;
  user: User;
}

export interface User {
  name: string;
  email: string;
}

export interface Course {
  title: string;
  desc: string;
  code: string;
}

const RecentClasses = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['RecentClasses'],
    queryFn: async () => {
      const response = await api.get(
        `/${user?.role}s/${user?.id}/classes/recent`
      );
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <>
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
      </>
    );
  }

  if (isError) {
    return <h1>An error occurred</h1>;
  }

  return (
    <div className="pt-2 flex flex-col gap-2">
      {data.recentClasses.length > 0 ? (
        data.recentClasses.map((classInfo: ClassInfoType) => (
          <ClassCard classInfo={classInfo} key={classInfo.id} />
        ))
      ) : (
        <Card>
          <CardContent>
            <p>You have no recent classes</p>
          </CardContent>
        </Card>
      )}
      {data.totalClasses >= 5 && (
        <Link className="self-end" to="/attendance">
          <Button className={cn('w-full md:w-auto ')}>View More</Button>
        </Link>
      )}
    </div>
  );
};

export default RecentClasses;
