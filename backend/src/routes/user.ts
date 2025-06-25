import { Router, Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import userController from '../controllers/user';

const router = Router();

router.get('/me', authenticateToken, userController.getMyProfile);

export default router;
