import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table';
import { Columns } from '@/components/classAttendance/columns';

type AttendanceStudent = {
  id: string;
  name: string;
  matricNumber: string;
  email?: string;
  attended: boolean;
  // attended: boolean;
};

type ClassAttendanceResponse = {
  presentStudentIds: string[];

  // class: {
  //   id: string;
  //   course: { id: string; code: string; title: string };
  //   startTime: string;
  //   endTime: string;
  // };
  students: AttendanceStudent[];
};

const ClassAttendanceRecord = () => {
  const { classId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['class-attendance', classId],
    queryFn: async (): Promise<ClassAttendanceResponse> => {
      const resp = await api.get(`/classes/${classId}/attendance`);
      return resp.data.data;
    },
    enabled: !!classId,
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

  if (isError || !data) {
    return (
      <Card className="bg-red-500/80">
        <CardContent>
          <p className="text-red-100">Failed to load attendance</p>
        </CardContent>
      </Card>
    );
  }

  const { students } = data;

  return (
    <div className="space-y-6">
      <DataTable columns={Columns} data={students} />
    </div>
  );
};

export default ClassAttendanceRecord;
