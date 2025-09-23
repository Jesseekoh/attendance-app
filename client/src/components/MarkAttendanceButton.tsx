import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { api } from '@/lib/axiosClient';
import { ErrorResponse } from '@/types';

interface MarkAttendanceButtonProps {
  classId: string;
}

export default function MarkAttendanceButton({
  classId,
}: MarkAttendanceButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentPositionAsync = (options?: PositionOptions) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const handleMarkAttendance = async () => {
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
        const data = axiosErr.response?.data as ErrorResponse;
        toast.error(data?.message || 'Something went wrong');
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
  return (
    <Button onClick={handleMarkAttendance} disabled={isSubmitting}>
      {isSubmitting ? 'Marking' : 'Mark attendance'}
    </Button>
  );
}
