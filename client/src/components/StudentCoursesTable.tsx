import { api } from '../lib/axiosClient';
import { useQuery } from '@tanstack/react-query';

const StudentCoursesTable = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get('/students/courses');
      console.log(response);
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
    return <h1>An error occured</h1>;
  }

  const courses = data.data;
  return (
    <div className="overflow-x-auto mb-4">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(
            (course: {
              title: string;
              code: string;
              desc: string;
              id: string;
            }) => (
              <tr className="" key={course.id}>
                <td>{course.title}</td>
                <td>{course.code}</td>
                <td>{course.desc}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {courses.length === 0 ? <p>You're not enrolled in any classes</p> : null}
    </div>
  );
};

export default StudentCoursesTable;
