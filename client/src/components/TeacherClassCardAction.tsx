import { Users, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router';
interface TeacherClassCardActionProps {
  classId: string;
  stats?: {
    totalStudents: number;
    absentStudents: number;
    presentStudents: number;
  };
}
export default function TeacherClassCardAction({
  classId,
  stats,
}: TeacherClassCardActionProps) {
  return (
    <>
      {stats && (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{stats.totalStudents} Total</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>{stats.presentStudents} Present</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" />
            <span>{stats.absentStudents} Absent</span>
          </div>
        </div>
      )}
      <Link
        to={`/classes/${classId}`}
        className="rounded-lg text-center inline-block w-full bg-primary text-primary-foreground px-4 py-2"
      >
        View Details
      </Link>
    </>
  );
}
