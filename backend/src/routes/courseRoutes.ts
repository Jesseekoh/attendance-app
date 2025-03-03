import { Router } from 'express';
import { enrollCourses } from '../controllers/courseController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, enrollCourses);

export default router;
