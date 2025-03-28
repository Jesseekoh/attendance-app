import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import classController from '../controllers/classController';
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
router.post('/', authenticateToken, classController.createClass);

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
router.get('/:classId', classController.getClass);

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
