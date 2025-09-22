import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ClassCardProps {
  className: string;
  subject: string;
  time: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export function ClassCard({
  className,
  subject,
  time,
  totalStudents,
  presentStudents,
  absentStudents,
  status,
}: ClassCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{className}</CardTitle>
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{subject}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>

    
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{totalStudents} Total</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{presentStudents} Present</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="w-4 h-4" />
              <span>{absentStudents} Absent</span>
            </div>
          </div>

          <div className="pt-2">
            {status === 'upcoming' && (
              <Button className="w-full" size="sm">
                Start Attendance
              </Button>
            )}
            {status === 'ongoing' && (
              <Button className="w-full" variant="outline" size="sm">
                Continue Attendance
              </Button>
            )}
            {status === 'completed' && (
              <Button className="w-full" variant="outline" size="sm">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
