import { Router } from 'express';
import studentController from '../controllers/student';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/courses', authenticateToken, studentController.getStudentCourses);
router.post('/courses', authenticateToken, studentController.enrollCourses);
router.get('/stats', authenticateToken, studentController.getStudentStats);

export default router;
