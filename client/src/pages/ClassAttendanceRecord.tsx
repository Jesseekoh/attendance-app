import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type AttendanceStudent = {
  id: string;
  name: string;
  email?: string;
  attended: boolean;
};

type ClassAttendanceResponse = {
  class: {
    id: string;
    course: { id: string; code: string; title: string };
    startTime: string;
    endTime: string;
  };
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

  const present = data.students.filter((s) => s.attended);
  const absent = data.students.filter((s) => !s.attended);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {data.class.course.code} — {data.class.course.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {new Date(data.class.startTime).toLocaleString()} -{' '}
            {new Date(data.class.endTime).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Present ({present.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {present.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between border p-3 rounded-md"
                >
                  <span>{s.name}</span>
                  {s.email && (
                    <span className="text-xs text-muted-foreground">
                      {s.email}
                    </span>
                  )}
                </li>
              ))}
              {present.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No one attended.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absent ({absent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {absent.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between border p-3 rounded-md"
                >
                  <span>{s.name}</span>
                  {s.email && (
                    <span className="text-xs text-muted-foreground">
                      {s.email}
                    </span>
                  )}
                </li>
              ))}
              {absent.length === 0 && (
                <p className="text-sm text-muted-foreground">No absences.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassAttendanceRecord;
