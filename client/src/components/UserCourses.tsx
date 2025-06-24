import { api } from '../lib/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
const UserCourses = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get(`/${user?.role}s/courses`);
      console.log(response);
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

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

  if (isError) {
    return (
      <Card className="bg-red-500/80">
        <CardContent>
          <p className="text-red-200">Error loading courses</p>
        </CardContent>
      </Card>
    );
  }

  const courses = data.data;
  return (
    <>
      {courses ? (
        <div className="overflow-x-auto mb-4">
          <Table>
            <TableCaption>Enrolled Courses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(
                (course: {
                  title: string;
                  code: string;
                  desc: string;
                  id: string;
                }) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.desc}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {courses.length === 0 && <p>You're not enrolled in any classes</p>}
        </div>
      ) : (
        <h1>No courses</h1>
      )}
    </>
  );
};

export default UserCourses;
