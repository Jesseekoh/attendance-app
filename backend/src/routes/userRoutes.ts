import { Router, Request } from 'express';
import { authenticateToken } from '../authMiddleWare';
import Student from '../models/Student';

const router = Router();

router.get('/me', authenticateToken, async (req: Request, res) => {
    const { id, email } = req.user;
    const user = await Student.findOne({
        where: { id: Buffer.from(id, 'hex') },
    });

    res.json({ status: 'success', data: { user } });
    return;
});

export default router;
