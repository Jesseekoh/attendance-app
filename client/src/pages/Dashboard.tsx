import { useState } from 'react';
import clsx from 'clsx';
import UpcomingClasses from '../components/UpcomingClasses';
import RecentClasses from '../components/RecentClasses';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="py-4">
      {/* <h3 className="text-2xl font-[Inter] font-bold">Dashboard</h3> */}
      {/* <div className="card"></div> */}
      <div className="flex shadow-md border-2 border-neutral/10 rounded-md items-center divide-x-3 divide-neutral/20">
        <div className="px-4">
          <div
            className="radial-progress text-primary flex-1"
            style={{ '--value': 70 } /* as React.CSSProperties */}
            aria-valuenow={70}
            role="progressbar"
          >
            70%
          </div>
        </div>
        <div className="stat flex-1">
          <h3 className="stat-title">Classes attendend</h3>
          <h1 className="stat-value">13</h1>
          <h3 className="stat-title">of 20 classes</h3>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lift mt-6">
        <button
          role="tab"
          className={clsx(
            'tab flex-1/2',
            activeTab === 'upcoming' && 'tab-active'
          )}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('upcoming');
          }}
        >
          Upcoming classes
        </button>

        <button
          role="tab"
          className={clsx(
            'tab flex-1/2',
            activeTab === 'recent' && 'tab-active'
          )}
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

export default Dashboard;
