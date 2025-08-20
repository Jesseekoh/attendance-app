import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
const StudentsList = () => {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['all-students'],
  //   queryFn: async () => {
  //     const resp = await api.get('/');
  //     return resp;
  //   },
  // });
  return <div>StudentsList</div>;
};

export default StudentsList;
