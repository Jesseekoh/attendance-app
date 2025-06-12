import { Request, Response, Router } from 'express';
import courseController from '../controllers/courseController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/courses/:
 *  get:
 *    summary: Get all courses
 *    responses:
 *      200:
 *        description: OK
 *
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 *  /api/v1/courses/:courseId/students:
 *    get:
 *      summary: Get all students taking a course
 *      parameters:
 *        - in: path
 *          name: courseId
 *          schema:
 *            type: string
 *          required: true
 *          description: The UUID of the course
 *      responses:
 *        200:
 *          description: OK
 */
router.get(
  '/:courseId/students',
  authenticateToken,
  courseController.getAllCourseStudents
);

// get all the attendance for the specified course
router.get('/:courseId/attendance', authenticateToken);

export default router;
