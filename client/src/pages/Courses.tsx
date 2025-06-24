// import EditCousesModal from '../components/EditCousesModal';
import { PencilLine } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import UserCourses from '@/components/UserCourses';
import { useState } from 'react';
import EditCourses from './EditCourses';
// TODO: use react query to handle errors gracefully instead of within each fetcher function
const Courses = () => {
  // const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div>
      <div className="flex gap-4">
        {!isEditing && (
          <Button className="ml-auto" onClick={() => setIsEditing(true)}>
            Edit Courses
            <PencilLine />
          </Button>
        )}
      </div>
      {/* <h3 className="text-2xl font-to-base-300">Courses</h3> */}

      {isEditing ? (
        <EditCourses setIsEditing={setIsEditing} />
      ) : (
        <UserCourses />
      )}
    </div>
  );
};

export default Courses;
