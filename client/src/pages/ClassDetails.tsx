import { useLoaderData, useParams } from 'react-router';
import { api } from '../api/axiosClient';
import { BookOpen, Calendar, Clock, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const ClassDetails = () => {
  const classData = useLoaderData();
  const { classId } = useParams();

  const handleSubmitAttendance = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await api
          .post('/classes/' + classId, {
            studentLocation: {
              latitude: 6.66973743,
              longitude: 3.63735952,
              // latitude: pos.coords.latitude,
              // longitude: pos.coords.longitude,
            },
          })
          .then(() => toast.success('Marked attendance successfully'))
          .catch((error: AxiosError) => {
            toast.error(error.response!.statusText);
            console.log(error);
          });
        console.log(pos);
        toast.success(
          'latitude: ' +
            pos.coords.latitude +
            ', longitude: ' +
            pos.coords.longitude
        );
      },
      (err) => console.log(err),
      { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
    );
  };

  const startTime = new Date(classData.data.startTime);
  const endTime = new Date(classData.data.endTime);
  return (
    <div>
      <h3 className="text-2xl font-bold font-[Inter] mb-4">Class Details</h3>

      <div className="card card-md !p-4">
        <div className="card-title">
          <h3 className="text-lg">{classData.data.course.title}</h3>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {/* <p>{data.data.course.desc}</p> */}
          <div className="flex gap-2">
            <BookOpen className="text-neutral/40" />
            <p>{classData.data.course.code}</p>
          </div>
          <div className="flex gap-2">
            <MapPin className="text-neutral/40" />
            <p>{classData.data.Venue.name}</p>
          </div>
          <div className="flex gap-2">
            <Calendar className="text-neutral/40" />
            <p>
              {startTime.toLocaleDateString([], {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Clock className="text-neutral/40" />
            <p>
              {startTime.toLocaleTimeString([], {})} -{' '}
              {endTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <User className="text-neutral/40" />
            <p>
              {classData.data.Teacher.User.firstName +
                ' ' +
                classData.data.Teacher.User.lastName}
            </p>
          </div>
        </div>
        <div className="card-action">
          <button
            className="btn bg-neutral text-neutral-content !rounded-lg w-full"
            type="button"
            onClick={handleSubmitAttendance}
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
