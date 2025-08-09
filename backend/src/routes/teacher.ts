import { Router } from 'express';
import {
  authenticateToken,
  roleBasedAccess,
} from '../middlewares/authMiddleware';
import {
  addTeacherCourses,
  getTeacherClasses,
  getTeacherCourses,
} from '../controllers/teacher';
import { Roles } from '../constants/role';

const router = Router();

// Get courses taught by a teacher
router.get(
  '/:teacherId/courses',
  authenticateToken,
  roleBasedAccess([Roles.TEACHER, Roles.ADMIN]),
  getTeacherCourses
);

// Add courses to list of courses taught by a teacher
router.post(
  '/:teacherId/courses',
  authenticateToken,
  roleBasedAccess([Roles.ADMIN, Roles.TEACHER]),
  addTeacherCourses
);

router.get(
  '/:teacherId/classes',
  authenticateToken,
  roleBasedAccess([Roles.ADMIN, Roles.TEACHER]),
  getTeacherClasses
);

export default router;
