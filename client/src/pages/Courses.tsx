// import EditCousesModal from '../components/EditCousesModal';
import { PencilLine } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import UserCourses from '@/components/UserCourses';
import { useState } from 'react';
import EditCourses from './EditCourses';
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
      <div className="overflow-x-auto">
        {/* <div className="w-[200%] h-60 border">hello</div> */}
        {isEditing ? (
          <EditCourses setIsEditing={setIsEditing} />
        ) : (
          <UserCourses />
        )}
      </div>
      {/* {isEditing ? (
        <EditCourses setIsEditing={setIsEditing} />
      ) : (
        <UserCourses />
      )} */}
    </div>
  );
};

export default Courses;
