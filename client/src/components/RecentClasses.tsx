import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import ClassCard from './ClassCard';
import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export interface ClassInfoType {
  id: string;
  teacherId: string;
  courseId: string;
  venueId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
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
  const {
    data: recentClasses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['RecentClasses'],
    queryFn: async () => {
      const response = await api.get('/classes/recent');
      return response.data;
    },
  });

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return <h1>An error occurred</h1>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="pt-2 flex flex-col gap-2">
          {recentClasses.data.totalClasses > 0 ? (
            recentClasses.data.recentClasses.map((classInfo: ClassInfoType) => (
              <ClassCard classInfo={classInfo} key={classInfo.id} />
            ))
          ) : (
            <p>You have no recent classes</p>
          )}
          {recentClasses.data.totalClasses > 10 && (
            <Link
              className="text-center bg-neutral text-neutral-content rounded-md py-2"
              to="/attendance"
            >
              View More
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentClasses;
