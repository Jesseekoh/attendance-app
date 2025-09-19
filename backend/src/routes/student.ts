import { Router } from 'express';
import studentController from '../controllers/student';
import {
  authenticateToken,
  roleBasedAccess,
} from '../middlewares/authMiddleware';
import { Roles } from '../constants/role';

const router = Router();

router.get(
  '/:studentId/courses',
  authenticateToken,
  studentController.getStudentCourses
);
router.post(
  '/:studentId/courses',
  authenticateToken,
  studentController.enrollCourses
);
router.get(
  '/:studentId/stats',
  authenticateToken,
  studentController.getStudentStats
);
router.get(
  '/:studentId/classes',
  authenticateToken,
  studentController.getStudentClasses
);

router.get(
  '/:studentId/classes/upcoming',
  authenticateToken,
  roleBasedAccess([Roles.STUDENT, Roles.ADMIN]),
  studentController.getStudentUpcomingClasses
);
router.get(
  '/:studentId/classes/recent',
  authenticateToken,
  roleBasedAccess([Roles.STUDENT, Roles.ADMIN]),
  studentController.getStudentRecentClasses
);

export default router;
