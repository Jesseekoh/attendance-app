import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    addTeacherCourses,
    getTeacherCourses,
} from '../controllers/teacherController';

const router = Router();

// Get courses taught by a teacher
router.get('/courses', authenticateToken, getTeacherCourses);

// Add courses to list of courses taught by a teacher
router.post('/courses', authenticateToken, addTeacherCourses);

export default router;
