import { Router, Request } from 'express';
import { authenticateToken } from '../authMiddleWare';

const router = Router();

router.get('/user-info', authenticateToken, (req: Request, res) => {
    console.log(req.user);

    res.json('user info');
    return;
});

export default router;
