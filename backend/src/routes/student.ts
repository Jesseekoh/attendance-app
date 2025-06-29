import { Router } from 'express';
import studentController from '../controllers/student';
import { authenticateToken } from '../middlewares/authMiddleware';

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

export default router;
