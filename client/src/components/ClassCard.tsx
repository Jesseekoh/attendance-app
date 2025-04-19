import { BookOpen, MapPin, User, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { ClassInfoType } from './RecentClasses';
import React from 'react';

interface ClassCardProps {
  classInfo: ClassInfoType;
}
const ClassCard: React.FC<ClassCardProps> = ({ classInfo }) => {
  return (
    <div>
      <div className="card card-md shadow-lg !p-4 border-neutral/20 border-2">
        <div className="card-title">
          <h3 className="text-lg">{classInfo.course.title}</h3>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          {/* <p>{data.data.course.desc}</p> */}
          <div className="flex gap-2">
            <BookOpen className="text-neutral/40" />
            <p>{classInfo.course.code}</p>
          </div>
          <div className="flex gap-2">
            <MapPin className="text-neutral/40" />
            <p>{classInfo.Venue.name}</p>
          </div>
          <div className="flex gap-2">
            <Calendar className="text-neutral/40" />
            <p>
              {new Date(classInfo.startTime).toLocaleDateString([], {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Clock className="text-neutral/40" />
            <p>
              {new Date(classInfo.startTime).toLocaleTimeString([], {})} -{' '}
              {new Date(classInfo.endTime).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <User className="text-neutral/40" />
            <p>
              {classInfo.Teacher.User.firstName +
                ' ' +
                classInfo.Teacher.User.lastName}
            </p>
          </div>
        </div>
        <div className="card-action">
          <Link
            to={'/classes/' + classInfo.id}
            className="btn bg-neutral text-neutral-content !rounded-lg w-full"
            type="button"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
