import UpcomingClasses from '../components/UpcomingClasses';
import RecentClasses from '../components/RecentClasses';
import DashboardStats from '../components/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import OngoingClasses from '@/components/OngoingClasses.tsx'
const StudentDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="rounded-lg bg-gradient-to-r from-[#42047e] to-[#07f49e] p-6 text-white">
        <h1 className="text-2xl font-bold">Good morning, {user?.name}</h1>
        <p className="text-blue-100 mt-1">
          You have 3 classes scheduled for today. 2 attendance sessions
          completed.
        </p>
      </div>
      <DashboardStats />
      <Card>
        <CardHeader>
          <CardTitle>Ongoing classes</CardTitle>
        </CardHeader>
        <CardContent>
          <OngoingClasses/>
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
