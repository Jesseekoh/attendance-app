import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import { User2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
const Profile = () => {
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
    return <p>An error occurred</p>;
  }
  return (
    <div>
      <div className="avatar w-full">
        <div className="rounded-full bg-sky-200 mx-auto">
          <User2 size={100} />
        </div>
      </div>
      <div>
        <h1 className="font-bold text-2xl text-center">
          {profileData.data.firstName + ' ' + profileData.data.lastName}
        </h1>
        <p className="text-neutral/60 text-center">
          {profileData.data.Student.matricNumber}
        </p>
      </div>
    </div>
  );
};

export default Profile;
