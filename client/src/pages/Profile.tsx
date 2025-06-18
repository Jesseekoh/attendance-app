import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/config/roles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { user } = useAuth();

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

  switch (user?.role) {
    case ROLES.ADMIN:
      return <h1>Admin Profile</h1>;
    case ROLES.STUDENT:
      return (
        <div>
          <Avatar className="w-[120px] h-[120px] aspect-auto">
            <AvatarImage src={user?.image ?? ''} alt="User profile picture" />
            <AvatarFallback>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-2xl text-center">
              {profileData.name}
            </h1>
            <p className="text-neutral/60 text-center">
              {profileData.student.matricNumber}
            </p>
            <p className="text-neutral/60 text-center">
              {profileData.student.level}
            </p>
          </div>
        </div>
      );
    case ROLES.TEACHER:
      return (
        <div>
          <Avatar className="w-[60px] h-[60px] aspect-auto">
            <AvatarImage src={user?.image ?? ''} alt="User profile picture" />
            <AvatarFallback>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-2xl text-center">
              {profileData.name}
            </h1>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default Profile;
