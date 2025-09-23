import { useAuth } from '@/contexts/AuthContext';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};
export default function GreetingBanner() {
  const { user } = useAuth();
  return (
    <div className="rounded-lg bg-gradient-to-r from-[#42047e] to-[#07f49e] p-6 text-white">
      <h1 className="text-2xl font-bold">
        {getGreeting()}, {user?.name}
      </h1>
      <p className="text-blue-100 mt-1">
        You have 3 classes scheduled for today. 2 attendance sessions completed.
      </p>
    </div>
  );
}
