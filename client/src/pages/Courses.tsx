import ClassQrScanner from '../components/ClassQrScanner';
import EditCousesModal from '../components/EditCousesModal';
import StudentCoursesTable from '../components/StudentCoursesTable';
import {useAuth} from '../contexts/AuthContext'
// TODO: use react query to handle errors gracefully instead of within each fetcher function
const Courses = () => {

  const {user} = useAuth()

  
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h3 className="text-2xl font-to-base-300">Courses</h3>
      <StudentCoursesTable />
      <EditCousesModal />
      <ClassQrScanner />
    </div>
  );
};

export default Courses;
