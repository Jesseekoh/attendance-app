import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Skeleton } from '@/components/ui/skeleton';
const StudentsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['all-students'],
    queryFn: async () => {
      const resp = await api.get('/');
      return resp;
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
    return <div>Error loading students</div>;
  }
  return <div>StudentsList</div>;
};

export default StudentsList;
