import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { api } from '../api/axiosClient';
import axios, { Axios } from 'axios';

const ClassDetails = () => {
  const { classId } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['class-details'],
    queryFn: async () => {
      return await api
        .get('/classes/' + classId)
        .then((response) => response.data);
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
    return <h1>An error occured</h1>;
  }
  if (data) {
    console.log(data);
  }
  return (
    <div>
      <h3>ClassDetails</h3>
      <p>{classId}</p>
      <h1>Venue</h1>
      <p>{data.data.Venue.name}</p>
      <h1>Start time</h1>
      <p>{new Date(data.data.startTime).toLocaleString()}</p>
      <h1>End time</h1>
      <p>{new Date(data.data.endTime).toLocaleString()}</p>

      <button className="btn btn-secondary">Mark Attendance</button>
    </div>
  );
};

export default ClassDetails;
