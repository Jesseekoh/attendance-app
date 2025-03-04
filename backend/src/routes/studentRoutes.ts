import { Router } from 'express';
import {
    enrollCourses,
    getStudentCourses,
} from '../controllers/studentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/courses', authenticateToken, getStudentCourses);
router.post('/courses', authenticateToken, enrollCourses);

export default router;
