import { BookOpen, MapPin, User, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { ClassInfoType } from './RecentClasses';
import React from 'react';
import clsx from 'clsx';
import {
  Card,
  CardContent,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ClassCardProps {
  classInfo: ClassInfoType;
}
const ClassCard: React.FC<ClassCardProps> = ({ classInfo }) => {
  return (
    // <div>
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>
          <h3 className="text-lg">{classInfo.course.title}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1.5 mb-4">
          {/* <p>{data.data.course.desc}</p> */}
          <div className="flex gap-12">
            <div className="flex gap-2">
              <BookOpen className="text-accent-foreground/35" />
              <p>{classInfo.course.code}</p>
            </div>
            <div className="flex gap-2">
              <MapPin className="text-accent-foreground/35" />
              <p>{classInfo.venue.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Calendar className="text-accent-foreground/35" />
            <p>
              {new Date(classInfo.startTime).toLocaleDateString([], {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Clock className="text-accent-foreground/35" />
            <p>
              {new Date(classInfo.startTime).toLocaleTimeString([], {})} -{' '}
              {new Date(classInfo.endTime).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <User className="text-accent-foreground/35" />
            <p>{classInfo.teacher.user.name}</p>
          </div>

          {classInfo.attended !== undefined && (
            <div>
              <div
                className={clsx('', {
                  'badge-success': classInfo.attended,
                  'badge-error': !classInfo.attended,
                })}
              >
                {classInfo.attended ? 'Attended' : 'Absent'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <CardAction className="w-full">
          <Link
            to={'/classes/' + classInfo.id}
            className="rounded-lg text-center inline-block w-full bg-primary text-primary-foreground px-4 py-2"
          >
            View Details
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
    // </div>
  );
};

export default ClassCard;
