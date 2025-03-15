import { Request, Response, Router } from 'express';
import { sequelize } from '../models';
import { authenticateToken } from '../middlewares/authMiddleware';
import { ITokenPayload } from '../types';

const router = Router();

// router.get('/courses/:courseId')

// get all students taking a course
router.get(
    '/:courseId/students',
    authenticateToken,
    (req: Request, res: Response) => {
        const { id } = req.user as ITokenPayload;
    }
);

// get all courses in a depsrtment

export default router;
