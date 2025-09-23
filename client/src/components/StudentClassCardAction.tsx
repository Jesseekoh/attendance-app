import MarkAttendanceButton from './MarkAttendanceButton';
import { Link } from 'react-router';
import { Button } from './ui/button';
interface StudentClassCardActionProps {
  classId: string;
}
export default function StudentClassCardAction({
  classId,
}: StudentClassCardActionProps) {
  return (
    <div className="flex gap-3">
      <Link to={`/classes/${classId}`}>
        <Button>View Details</Button>
      </Link>
      <MarkAttendanceButton classId={classId} />
    </div>
  );
}
