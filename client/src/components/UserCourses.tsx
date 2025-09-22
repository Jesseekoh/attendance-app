import { api } from '../lib/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
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
import { ROLES } from '@/config/roles';
import CoursesTableSkeleton from './CoursesTableSkeleton';
const UserCourses = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-courses'],
    queryFn: async () => {
      const response = await api.get(`/${user?.role}s/${user?.id}/courses`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isLoading) {
    return <CoursesTableSkeleton />;
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
      {courses.length > 0 ? (
        <div className="border pb-2">
          <Table>
            <TableCaption>
              {user?.role === ROLES.STUDENT
                ? 'Enrolled Courses'
                : 'Taught Courses'}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
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
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {courses.length === 0 &&
            (user?.role === ROLES.STUDENT ? (
              <p>You're not enrolled in any classes</p>
            ) : (
              <p>You currently teach no courses</p>
            ))}
        </div>
      ) : (
        <h1>No courses</h1>
      )}
    </>
  );
};

export default UserCourses;
