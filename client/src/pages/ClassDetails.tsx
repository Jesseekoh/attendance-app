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
import MarkAttendanceButton from '@/components/MarkAttendanceButton';

const ClassDetails = () => {
  const classData = useLoaderData();
  const { classId } = useParams();
  const { user } = useAuth();

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
                <MarkAttendanceButton classId={classId!} />
              </div>
            </CardAction>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ClassDetails;
