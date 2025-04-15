import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { BookOpen, MapPin, User, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';
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

  if (isError) {
    return <p>An error occurred getting classes</p>;
  }

  return (
    <div className="pt-2 flex flex-col gap-2">
      {upcomingClasses.data.length > 0 ? (
        upcomingClasses.data.map((classInfo) => (
          <div key={classInfo.id}>
            <div className="card card-md shadow-lg !p-4 border-neutral/20 border-2">
              <div className="card-title">
                <h3 className="text-lg">{classInfo.course.title}</h3>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                {/* <p>{data.data.course.desc}</p> */}
                <div className="flex gap-2">
                  <BookOpen className="text-neutral/40" />
                  <p>{classInfo.course.code}</p>
                </div>
                <div className="flex gap-2">
                  <MapPin className="text-neutral/40" />
                  <p>{classInfo.Venue.name}</p>
                </div>
                <div className="flex gap-2">
                  <Calendar className="text-neutral/40" />
                  <p>
                    {new Date(classInfo.startTime).toLocaleDateString([], {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Clock className="text-neutral/40" />
                  <p>
                    {new Date(classInfo.startTime).toLocaleTimeString([], {})} -{' '}
                    {new Date(classInfo.endTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <User className="text-neutral/40" />
                  <p>
                    {classInfo.Teacher.User.firstName +
                      ' ' +
                      classInfo.Teacher.User.lastName}
                  </p>
                </div>
              </div>
              <div className="card-action">
                <Link
                  to={'/classes/' + classInfo.id}
                  className="btn bg-neutral text-neutral-content !rounded-lg w-full"
                  type="button"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>You have no upcoming classes.</p>
      )}
    </div>
  );
};

export default UpcomingClasses;
