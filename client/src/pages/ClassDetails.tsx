import { useLoaderData, useParams } from 'react-router';
import { useState } from 'react';
import { api } from '../lib/axiosClient';
import { BookOpen, Calendar, Clock, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/config/roles';

const ClassDetails = () => {
  const classData = useLoaderData();
  const { classId } = useParams();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentPositionAsync = (options?: PositionOptions) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const handleSubmitAttendance = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const pos = await getCurrentPositionAsync({
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: true,
      });

      try {
        await api.post('/classes/' + classId, {
          studentLocation: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
        toast.success('Marked attendance successfully');
      } catch (error) {
        const axiosErr = error as AxiosError;
        toast.error(axiosErr.response?.statusText || 'Something went wrong');
        console.log(error);
      }
    } catch (err: unknown) {
      let message = 'Unable to get location';
      const geoErr = err as GeolocationPositionError & { message?: string };
      if (typeof geoErr === 'object' && geoErr && 'code' in geoErr) {
        switch (geoErr.code) {
          case geoErr.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case geoErr.POSITION_UNAVAILABLE:
            message = 'Location unavailable';
            break;
          case geoErr.TIMEOUT:
            message = 'Location request timed out';
            break;
          default:
            message = geoErr.message || message;
        }
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTime = new Date(classData.data.startTime);
  const endTime = new Date(classData.data.endTime);
  return (
    <div>
      <h3 className="text-2xl font-bold font-[Inter] mb-4">Class Details</h3>

      <Card>
        <CardHeader>
          <CardTitle>
            <h3 className="text-lg">{classData.data.course.title}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mb-8">
            {/* <p>{data.data.course.desc}</p> */}
            <div className="flex gap-2">
              <BookOpen className="text-base-content/60" />
              <p>{classData.data.course.code}</p>
            </div>
            <div className="flex gap-2">
              <MapPin className="text-base-content/60" />
              <p>{classData.data.venue.name}</p>
            </div>
            <div className="flex gap-2">
              <Calendar className="text-base-content/60" />
              <p>
                {startTime.toLocaleDateString([], {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Clock className="text-base-content/60" />
              <p>
                {startTime.toLocaleTimeString([], {})} -{' '}
                {endTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <User className="text-base-content/60" />
              <p>{classData.data.teacher.user.name}</p>
            </div>
          </div>
        </CardContent>
        {user?.role === ROLES.STUDENT && (
          <CardFooter>
            <CardAction>
              <div className="card-action">
                <Button
                  className="w-full"
                  type="button"
                  onClick={handleSubmitAttendance}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Marking…' : 'Mark Attendance'}
                </Button>
              </div>
            </CardAction>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ClassDetails;
