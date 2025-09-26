import { Router } from 'express';
import studentController from '../controllers/student';
import {
  authenticateToken,
  roleBasedAccess,
} from '../middlewares/authMiddleware';
import { Roles } from '../constants/role';

const router = Router();

/**
 * @openapi
 * /students/{studentId}/courses:
 *   get:
 *     summary: Get all courses a student is enrolled in
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The student's user ID
 *     responses:
 *       200:
 *         description: Successfully fetched courses
 *       404:
 *         description: Student not found
 */
router.get(
  '/:studentId/courses',
  authenticateToken,
  studentController.getStudentCourses
);
/**
 * @openapi
 * /students/{studentId}/courses:
 *   post:
 *     summary: Enroll a student in courses
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The student's user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Successfully enrolled courses
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Only students can enroll courses
 */
router.post(
  '/:studentId/courses',
  authenticateToken,
  studentController.enrollCourses
);
/**
 * @openapi
 * /students/{studentId}/stats:
 *   get:
 *     summary: Get student statistics
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched stats successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Error fetching stats
 */
router.get(
  '/:studentId/stats',
  authenticateToken,
  studentController.getStudentStats
);
/**
 * @openapi
 * /students/{studentId}/classes:
 *   get:
 *     summary: Get all classes for a student
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched classes successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 */
router.get(
  '/:studentId/classes',
  authenticateToken,
  studentController.getStudentClasses
);

/**
 * @openapi
 * /students/{studentId}/classes/ongoing:
 *   get:
 *     summary: Get ongoing classes for a student
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched ongoing classes successfully
 */
router.get(
  '/:studentId/classes/ongoing',
  authenticateToken,
  roleBasedAccess([Roles.STUDENT, Roles.ADMIN]),
  studentController.getStudentOngoingClasses
);

/**
 * @openapi
 * /students/{studentId}/classes/upcoming:
 *   get:
 *     summary: Get upcoming classes for a student
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched upcoming classes successfully
 */
router.get(
  '/:studentId/classes/upcoming',
  authenticateToken,
  roleBasedAccess([Roles.STUDENT, Roles.ADMIN]),
  studentController.getStudentUpcomingClasses
);
/**
 * @openapi
 * /students/{studentId}/classes/recent:
 *   get:
 *     summary: Get recent classes for a student
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fetched recent classes successfully
 */
router.get(
  '/:studentId/classes/recent',
  authenticateToken,
  roleBasedAccess([Roles.STUDENT, Roles.ADMIN]),
  studentController.getStudentRecentClasses
);
/**
 * @openapi
 * /students/{studentId}/classes/today:
 *   get:
 *     summary: Get today's classes for a student
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: timezone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched today's classes successfully
 *       400:
 *         description: Invalid query parameter
 *       404:
 *         description: Student not found
 *       403:
 *         description: Forbidden
 */
router.get(
  '/:studentId/classes/today',
  authenticateToken,
  studentController.getStudentTodayClasses
);

export default router;
