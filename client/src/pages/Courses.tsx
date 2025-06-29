import { PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserCourses from '@/components/UserCourses';
import { useState } from 'react';
import EditCourses from './EditCourses';
const Courses = () => {
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
        {isEditing ? (
          <EditCourses setIsEditing={setIsEditing} />
        ) : (
          <UserCourses />
        )}
      </div>
    </div>
  );
};

export default Courses;
