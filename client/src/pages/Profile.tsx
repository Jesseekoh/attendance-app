import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import { User2 } from 'lucide-react';
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
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
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
