import Router from 'express';
import {
    logInUser,
    logOutUser,
    refreshToken,
    registerUser,
} from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', logInUser);
router.post('/logout', logOutUser);
router.post('/refresh-token', refreshToken);
export default router;
