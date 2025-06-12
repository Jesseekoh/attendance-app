import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  student: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  class: string;
  time: string;
  status: 'present' | 'absent' | 'late';
}

const activities: ActivityItem[] = [
  {
    id: '1',
    student: { name: 'Emma Johnson', initials: 'EJ' },
    action: 'Marked present',
    class: 'Math 101',
    time: '2 hours ago',
    status: 'present',
  },
  {
    id: '2',
    student: { name: 'Michael Chen', initials: 'MC' },
    action: 'Marked absent',
    class: 'Physics 201',
    time: '3 hours ago',
    status: 'absent',
  },
  {
    id: '3',
    student: { name: 'Sarah Williams', initials: 'SW' },
    action: 'Marked late',
    class: 'Chemistry 101',
    time: '4 hours ago',
    status: 'late',
  },
  {
    id: '4',
    student: { name: 'David Brown', initials: 'DB' },
    action: 'Marked present',
    class: 'Biology 101',
    time: '5 hours ago',
    status: 'present',
  },
];

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={activity.student.avatar || '/placeholder.svg'}
                />
                <AvatarFallback className="text-xs">
                  {activity.student.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.student.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action} in {activity.class}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
