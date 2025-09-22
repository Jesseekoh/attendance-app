import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import ClassCard from '@/components/ClassCard';
import { ClassInfoType } from '@/components/RecentClasses';
import { Card, CardContent } from '@/components/ui/card';
const TeacherClasses = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teacher-classes'],
    queryFn: async () => {
      const resp = await api.get(`/teachers/${user?.id}/classes`);
      return resp.data.data;
    },
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
    return <h1>An error occurred</h1>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.length > 0 ? (
        data.map((classInfo: ClassInfoType) => (
          <ClassCard
            classInfo={classInfo}
            key={classInfo.id}
            withFooter
            footerLinkTo={`/classes/${classInfo.id}/attendance`}
            footerLabel="View Attendance"
          />
        ))
      ) : (
        <Card>
          <CardContent>
            <p>You have no recent classes</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherClasses;
