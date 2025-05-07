import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import ClassCard from './ClassCard';
import { Link } from 'react-router';

export interface ClassInfoType {
  id: string;
  teacherId: string;
  courseId: string;
  venueId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  Venue: Venue;
  Teacher: Teacher;
  course: Course;
  attended?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}

export interface Teacher {
  id: string;
  department: string;
  User: User;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Course {
  title: string;
  desc: string;
  code: string;
}

const RecentClasses = () => {
  const {
    data: recentClasses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['RecentClasses'],
    queryFn: async () => {
      const response = await api.get('/classes/recent');
      console.log(response.data);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
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
    return <h1>An error occurred</h1>;
  }

  return (
    <div className="pt-2 flex flex-col gap-2">
      {recentClasses.data.rows.length > 0 ? (
        recentClasses.data.rows.map((classInfo: ClassInfoType) => (
          <ClassCard classInfo={classInfo} key={classInfo.id} />
        ))
      ) : (
        <p>You have no recent classes</p>
      )}
      {recentClasses.data.rows.length >= 10 && (
        <Link to="/attendance">View More</Link>
      )}
    </div>
  );
};

export default RecentClasses;
