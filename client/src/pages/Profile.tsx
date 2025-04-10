import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { useStore } from '../stores/appStore';
import { api } from '../api/axiosClient';
const Profile = () => {
  const { updateUser } = useStore();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const response = await api.get('/users/me');
        console.log(data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            updateUser(null);
            navigate('/signin');
          }
          return error.response?.data;
        }
      }
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return <p>An error occurred</p>;
  }
  return <div>{data.data.user.firstName}</div>;
};

export default Profile;
