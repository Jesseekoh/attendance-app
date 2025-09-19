import { Router } from 'express';
import {
  authenticateToken,
  roleBasedAccess,
} from '../middlewares/authMiddleware';
import {
  addTeacherCourses,
  getTeacherClasses,
  getTeacherCourses,
  getTeacherRecentClasses,
  getTeacherUpcomingClasses,
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

/**
 * @swagger
 * /api/v1/teachers/{teacherId}/classes:
 *   get:
 *     summary: Get all classes taught by a teacher
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         schema:
 *           type: string
 *         required: true
 *         description: Teacher's ID
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         required: false
 *         description: Order of classes. Default is descending.
 *     responses:
 *       200:
 *         description: Fetched classes successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:teacherId/classes',
  authenticateToken,
  roleBasedAccess([Roles.ADMIN, Roles.TEACHER]),
  getTeacherClasses
);

/**
 * @swagger
 * /api/v1/teachers/{teacherId}/classes/recent:
 *   get:
 *     summary: Get recent classes for a teacher
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         schema:
 *           type: string
 *         required: true
 *         description: Teacher's ID
 *     responses:
 *       200:
 *         description: Fetched recent classes successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */

router.get(
  '/:teacherId/classes/recent',
  authenticateToken,
  roleBasedAccess([Roles.ADMIN, Roles.TEACHER]),
  getTeacherRecentClasses
);

/**
 * @swagger
 * /api/v1/teachers/{teacherId}/classes/upcoming:
 *   get:
 *     summary: Get upcoming classes for a teacher
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         schema:
 *           type: string
 *         required: true
 *         description: Teacher's ID
 *     responses:
 *       200:
 *         description: Fetched upcoming classes successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */

router.get(
  '/:teacherId/classes/upcoming',
  authenticateToken,
  roleBasedAccess([Roles.TEACHER, Roles.ADMIN]),
  getTeacherUpcomingClasses
);

export default router;
