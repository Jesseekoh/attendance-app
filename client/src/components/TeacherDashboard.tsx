import { Users, Clock, Calendar } from 'lucide-react';
import { StatsCard } from './stats-card';
import { Card, CardTitle, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';

import { ClassCard } from './class-card';
import { RecentActivity } from './recent-activity';
import ScheduleClass from './ScheduleClass';
import { useAuth } from '@/contexts/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const todaysClasses = [
    {
      className: 'Mathematics 101',
      subject: 'Algebra & Geometry',
      time: '9:00 AM - 10:30 AM',
      totalStudents: 28,
      presentStudents: 25,
      absentStudents: 3,
      status: 'completed' as const,
    },
    {
      className: 'Mathematics 201',
      subject: 'Calculus',
      time: '11:00 AM - 12:30 PM',
      totalStudents: 24,
      presentStudents: 22,
      absentStudents: 2,
      status: 'ongoing' as const,
    },
    {
      className: 'Mathematics 301',
      subject: 'Advanced Statistics',
      time: '2:00 PM - 3:30 PM',
      totalStudents: 20,
      presentStudents: 0,
      absentStudents: 0,
      status: 'upcoming' as const,
    },
  ];
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Good morning, {user.name}</h1>
        <p className="text-blue-100 mt-1">
          You have 3 classes scheduled for today. 2 attendance sessions
          completed.
        </p>
      </div>
      <ScheduleClass />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Students"
          value={156}
          description="Across all classes"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Classes Today"
          value={3}
          description="2 completed, 1 upcoming"
          icon={Clock}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Today's Classes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Classes
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                {todaysClasses.map((classItem, index) => (
                  <ClassCard key={index} {...classItem} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Classes
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                {todaysClasses.map((classItem, index) => (
                  <ClassCard key={index} {...classItem} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
