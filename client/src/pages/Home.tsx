import { SquareCheckBig } from 'lucide-react';
import { Link, Navigate } from 'react-router';
import { useStore } from '../stores/appStore';
const Home = () => {
  return (
    <>
      <main>
        <div className="hero">
          <div className="container flex flex-col items-center gap-6 px-4 pt-10 pb-20">
            <h1 className="font-[Inter] font-semibold text-center text-5xl">
              Effortless{' '}
              <span className="bg-clip-text bg-gradient-to-tl from-violet-500 to-emerald-400 text-transparent inline-block">
                Attendance
              </span>
              Tracking.
            </h1>

            <p className="text-center text-neutral-600 text-xl">
              A tool for keeping track of attendance in real-time with ease. No
              more paperwork, just seamless check-ins.
            </p>

            <Link to={'/signup'} className="">
              <button className="px-4 py-2 bg-emerald-400 rounded-lg text-lg text-white">
                Get started
              </button>
            </Link>
          </div>
        </div>

        <div className="about">
          <div className="container px-4">
            <h2 className="text-center text-2xl font-semibold font-[Inter] mb-4">
              Why this app?
            </h2>
            <p className="text-center text-lg text-neutral-600">
              Managing attendance shouldn't be a hassle. Our app helps you track
              employee or student attendance seamlessly with real-time updates,
              automated reports, and powerful analytics.
            </p>
            <ul className="text-neutral-500">
              <li className="flex gap-2">
                <SquareCheckBig />
                <span>Students can mark attendance with one tap</span>
              </li>
              <li className="flex gap-2">
                <SquareCheckBig />
                <span>Students can mark attendance with one tap</span>
              </li>
              <li className="flex gap-2">
                <SquareCheckBig />
                <span>Students can mark attendance with one tap</span>
              </li>
              <li className="flex gap-2">
                <SquareCheckBig />
                <span>Students can mark attendance with one tap</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
