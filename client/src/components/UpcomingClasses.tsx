import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import ClassCard from './ClassCard';
import { ClassInfoType } from './RecentClasses';
const UpcomingClasses = () => {
  const {
    data: upcomingClasses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['upcomingClasses'],
    queryFn: async () => {
      const response = await api.get('/classes/upcoming');
      console.log(response.data);
      return response.data;
    },
  });

  if (isError) {
    return <p>An error occurred getting classes</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-2 flex flex-col gap-2">
      {upcomingClasses.data.length > 0 ? (
        upcomingClasses.data.map((classInfo: ClassInfoType) => (
          <ClassCard classInfo={classInfo} key={classInfo.id} />
        ))
      ) : (
        <p>You have no upcoming classes.</p>
      )}
    </div>
  );
};

export default UpcomingClasses;
