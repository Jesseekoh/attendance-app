import { Router } from 'express';
import {
  authenticateToken,
  roleBasedAccess,
} from '../middlewares/authMiddleware';
import classController from '../controllers/class';
import { Roles } from '../constants/role';
const router = Router();

/**
 * @swagger
 *  /api/v1/classes:
 *    post:
 *      summary: Create class
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Class"
 *      responses:
 *        "200":
 *          description: Class created successfully
 *        403:
 *          description: Only teachers can access this route
 *        400:
 *          description: Class already exists
 */
router.post(
  '/',
  authenticateToken,
  roleBasedAccess([Roles.TEACHER, Roles.ADMIN]),
  classController.createClass
);

/**
 * @swagger
 *  /api/v1/classes/upcoming:
 *    get:
 *      summary: Gets all upcoming classes
 *      responses:
 *        "200":
 *          description: OK
 *        500:
 *          description: Server error

 */
router.get('/upcoming', authenticateToken, classController.getUpcomingClasses);
/**
 * @swagger
 *  /api/v1/classes/upcoming:
 *    get:
 *      summary: Gets all upcoming classes
 *      responses:
 *        "200":
 *          description: OK
 *        500:
 *          description: Server error

 */
router.get('/recent', authenticateToken, classController.getRecentClasses);

/**
 * @swagger
 *  /api/v1/classes/ongoing:
 *    get:
 *      summary: Gets all ongoing classes
 *      responses:
 *        "200":
 *          description: OK
 *        500:
 *          description: Server error

 */

router.get('/ongoing', authenticateToken, classController.getOngoingClasses);

/**
 * @swagger
 *  /api/v1/classes/:classId:
 *    get:
 *      summary: Get class by specified ID
 *      parameters:
 *        - in: path
 *          name: classId
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of class to get
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Class"
 *        404:
 *          description: Class not found
 */
router.get('/:classId', authenticateToken, classController.getClass);

router.get(
  '/:classId/attendance',
  authenticateToken,
  classController.getClassAttendance
);

/**
 * @swagger
 *  /api/v1/class/:classId:
 *    post:
 *      summary: Mark attendance for a class
 *      parameters:
 *        - in: path
 *          name: classId
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of class to get
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                studentLocation:
 *                  type: object
 *                  properties:
 *                    latitude:
 *                      type: number
 *                    longitude:
 *                      type: number
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  message:
 *                    type: string
 *        404:
 *          description: Class not found
 *
 */
router.post('/:classId', authenticateToken, classController.markAttendance);

/**
 * @swagger
 *  /api/v1/classes/:classId:
 *    put:
 *      summary: Update class details
 *      parameters:
 *        - in: path
 *          name: classId
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of class to get
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Class"
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  message:
 *                    type: string
 *        404:
 *          description: Class not found
 *
 */
// Update class details
router.put('/:classId', authenticateToken, classController.updateClassDetails);

export default router;
