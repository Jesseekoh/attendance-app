import { useState } from 'react';
import clsx from 'clsx';
import UpcomingClasses from '../components/UpcomingClasses';
import RecentClasses from '../components/RecentClasses';
import DashboardStats from '../components/DashboardStats';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  return (
    <div className="py-4">
      <DashboardStats />
      <div className="card !px-4">
        <div className="card-title">Ongoing classes</div>
        <div className="card-body px-0">
          <p>You have no ongoing classes...</p>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lift mt-6">
        <button
          role="tab"
          className={clsx('tab', activeTab === 'upcoming' && 'tab-active')}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('upcoming');
          }}
        >
          Upcoming classes
        </button>

        <button
          role="tab"
          className={clsx('tab', activeTab === 'recent' && 'tab-active')}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('recent');
          }}
        >
          Recent Classes
        </button>
      </div>
      <div>{activeTab === 'upcoming' && <UpcomingClasses />}</div>
      <div>{activeTab === 'recent' && <RecentClasses />}</div>
    </div>
  );
};

export default StudentDashboard;
