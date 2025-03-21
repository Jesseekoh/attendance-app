import { Request, Response, Router } from 'express';
import { sequelize } from '../models';
import courseController from '../controllers/courseController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Get all courses
router.get('/', courseController.getAllCourses);

// get all students taking a course
router.get(
    '/:courseId/students',
    authenticateToken,
    courseController.getAllCourseStudents
);

// get all the attendance for the specified course
router.get('/:courseId/attendance', authenticateToken);

export default router;
