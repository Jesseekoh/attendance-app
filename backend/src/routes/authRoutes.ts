import Router from 'express';
import userController from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *    summary: Register a new user
 *    description: Register a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                description: The first name of the user
 *              lastName:
 *                type: string
 *                description: The last name of the user
 *              email:
 *                type: string
 *                description: The email address of the user
 *              role:
 *                type: string
 *                description: The role of the user. Can be either student or teacher
 *              matricNumber:
 *                type: string
 *                description: The user's matric number if the user is a student
 *              department:
 *                type: string
 *                description: The department of the user
 *    responses:
 *      "200":
 *        description: User registered successfully
 *      "400":
 *        description: Invalid request body
 *      "409":
 *        description: User already exists

 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Log in a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      "200":
 *        description: User logged in successfully
 *      "400":
 *        description: Invalid request body
 *      "404":
 *        description: User not found
 */
router.post('/login', userController.logInUser);

/**
 * @swagger
 *  /api/v1/auth/logout:
 *    post:
 *      summary: Log user out
 *      responses:
 *        "200":
 *          description: User logged out successfully
 */
router.post('/logout', userController.logOutUser);

/**
 * @swagger
 *  /api/v1/auth/refresh-token:
 *    post:
 *      summary: refresh JWT
 *    responses:
 *      "200":
 *        descripton: Tokens refreshed successfully
 */
router.post('/refresh-token', userController.refreshToken);
export default router;
