import { Router, Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import User from '../models/User';
import { getMyProfile } from '../controllers/userController';

const router = Router();

router.get('/me', authenticateToken, getMyProfile);

export default router;
