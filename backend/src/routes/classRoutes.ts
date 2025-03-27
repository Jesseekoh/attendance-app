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
 *              type: object
 *              properties:
 *                courseId:
 *                  type: string
 *                  description: The ID of the course the class if for
 *                venueId:
 *                  type: string
 *                  description: The ID of the venue where the class is to be held
 *                startTime:
 *                  type: string
 *                  description: When the class is to start
 *                endTime:
 *                  type: string
 *                  description: When the class is to end
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
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *
 *
 */
router.get('/:classId', classController.getClass);

// attend class
router.post('/:classId', authenticateToken, classController.markAttendance);
// Update class details
router.put('/:classId', authenticateToken, classController.updateClassDetails);

export default router;
