import { BookOpen, MapPin, User, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { ClassInfoType } from './RecentClasses';
import React from 'react';
import {
  Card,
  CardContent,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
interface ClassCardProps {
  classInfo: ClassInfoType;
  withFooter?: boolean;
}
const ClassCard: React.FC<ClassCardProps> = ({ classInfo, withFooter }) => {
  console.log(classInfo.attended);
  return (
    // <div>
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <h3 className="text-lg">{classInfo.course.code}</h3>
          {classInfo.attended !== undefined && (
            <Badge
              variant="outline"
              className={cn(
                'text-white',
                classInfo.attended ? 'bg-green-400' : 'bg-red-400'
              )}
            >
              {classInfo.attended ? 'Attended' : 'Missed'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 mb-4 flex-wrap">
          {/* <p>{data.data.course.desc}</p> */}

          <div className="flex gap-2">
            <BookOpen className="text-accent-foreground/35" />
            <p>{classInfo.course.title}</p>
          </div>
          <div className="flex gap-2">
            <MapPin className="text-accent-foreground/35" />
            <p>{classInfo.venue.name}</p>
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
        </div>
      </CardContent>
      {withFooter && (
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
      )}
    </Card>
    // </div>
  );
};

export default ClassCard;
