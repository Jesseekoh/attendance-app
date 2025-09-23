import { BookOpen, MapPin, User, Calendar, Clock } from 'lucide-react';
import { ClassInfoType } from './RecentClasses';
import * as React from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/config/roles';
import StudentClassCardAction from './StudentClassCardAction';
import TeacherClassCardAction from './TeacherClassCardAction';

type ClassStats = {
  totalStudents: number;
  absentStudents: number;
  presentStudents: number;
};
interface ClassCardProps {
  classInfo: ClassInfoType;
  withFooter?: boolean;
  stats?: ClassStats;
  footerLinkTo?: string;
  footerLabel?: string;
}
const ClassCard: React.FC<ClassCardProps> = ({
  classInfo,
  withFooter,
  footerLinkTo,
  footerLabel,
  stats,
}) => {
  const { user } = useAuth();
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
          <CardAction>
            {user?.role === ROLES.STUDENT && (
              <StudentClassCardAction classId={classInfo.id} />
            )}
            {user?.role === ROLES.TEACHER && (
              <TeacherClassCardAction classId={classInfo.id} stats={stats} />
            )}
          </CardAction>
        </CardFooter>
      )}
    </Card>
    // </div>
  );
};

export default ClassCard;
