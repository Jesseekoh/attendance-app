import UpcomingClasses from '../components/UpcomingClasses';
import RecentClasses from '../components/RecentClasses';
import DashboardStats from '../components/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OngoingClasses from '@/components/OngoingClasses.tsx';
import GreetingBanner from './GreetingBanner';
const StudentDashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <GreetingBanner />
      <DashboardStats />
      <Card>
        <CardHeader>
          <CardTitle>Ongoing classes</CardTitle>
        </CardHeader>
        <CardContent>
          <OngoingClasses />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <UpcomingClasses />
            </TabsContent>
            <TabsContent value="recent">
              <RecentClasses />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
