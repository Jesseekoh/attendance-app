import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import classController from '../controllers/classController';
const router = Router();

router.get('/:classId', classController.getClass);

// create a class
router.post('/', authenticateToken, classController.createClass);

export default router;
