import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
const DashboardStats = () => {
  const {
    data: studentStats,
    isLoading: studentStatsIsLoading,
    isError: studentStatsIsError,
  } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () =>
      await api.get('/students/stats').then((resp) => resp.data),
  });

  if (studentStatsIsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  let attendancePercentage;
  if (studentStats) {
    attendancePercentage =
      (studentStats.data.attendedClasses / studentStats.data.totalClasses) *
      100;
  }
  return (
    <div className="flex shadow-md border-2 border-neutral/10 rounded-md items-center divide-x-3 divide-neutral/20">
      <div className="px-4">
        <div
          className="radial-progress  text-base-content flex-1"
          style={
            {
              '--value': studentStatsIsError ? 0 : attendancePercentage,
            } as React.CSSProperties
          }
          aria-valuenow={studentStatsIsError ? 0 : attendancePercentage}
          role="progressbar"
        >
          {studentStatsIsError ? '--' : attendancePercentage?.toFixed(2)} %
        </div>
      </div>
      <div className="stat flex-1">
        <h3 className="stat-title">Classes attendend</h3>
        {studentStats && (
          <>
            <h1 className="stat-value">{studentStats.data.attendedClasses}</h1>
            <h3 className="stat-title">
              of {studentStats.data.totalClasses} classes
            </h3>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
