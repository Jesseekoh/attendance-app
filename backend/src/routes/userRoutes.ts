import { Router, Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import User from '../models/User';
import userController from '../controllers/userController';

const router = Router();

router.get('/me', authenticateToken, userController.getMyProfile);

export default router;
