import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Button } from './ui/button';
// import { api } from '../api/axiosClient';
const EditCousesModal = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['all-courses'],
    queryFn: async () => {
      return api.get('/courses').then((data) => {
        console.log(data);
        return data.data;
      });
    },
  });

  return (
    <>
      <Button>Enroll courses</Button>
    </>
  );
};

export default EditCousesModal;
