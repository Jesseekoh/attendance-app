import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axiosClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Clock } from 'lucide-react';
import { StatsCard } from './stats-card';
import { Card, CardContent } from '@/components/ui/card';
const DashboardStats = () => {
  const {
    data: studentStats,
    isLoading: studentStatsIsLoading,
    isError: studentStatsIsError,
  } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () =>
      await api.get('/students/stats').then((resp) => resp.data.data),
  });

  if (studentStatsIsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (studentStatsIsError) {
    return (
      <Card className="bg-red-500/80">
        <CardContent>
          <p className="text-red-200">Error loading courses</p>
        </CardContent>
      </Card>
    );
  }

  const { attendedClasses, totalClasses } = studentStats;

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Attendance"
          value={1}
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
        <StatsCard
          title="Classes Attended"
          value={attendedClasses}
          description={`Out of ${totalClasses} classes`}
          icon={Clock}
        />
      </div>
    </>
  );
};

export default DashboardStats;
