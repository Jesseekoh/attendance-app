import { Router, Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleWare';
import User from '../models/User';

const router = Router();

router.get('/me', authenticateToken, async (req: Request, res) => {
    const { id, email } = req.user;
    const user = await User.findOne({
        where: { id },
    });

    res.json({ status: 'success', data: { user } });
    return;
});

export default router;
