import Router from 'express';
import userController from '../controllers/userController';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.logInUser);
router.post('/logout', userController.logOutUser);
router.post('/refresh-token', userController.refreshToken);
export default router;
