import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import classController from '../controllers/classController';
const router = Router();

// create a class
router.post('/', authenticateToken, classController.createClass);

// get class details
router.get('/:classId', classController.getClass);

// attend class
router.post('/:classId', authenticateToken, classController.markAttendance);
// Update class details
router.put('/:classId', authenticateToken, classController.updateClassDetails);

export default router;
