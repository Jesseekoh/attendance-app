import bcrypt from 'bcrypt';
import { z } from 'zod';
import Router from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/helper';
import { Student, Teacher } from '../models';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
const router = Router();

router.post('/register', async (req, res) => {
    try {
        // parse and validate request body using register schema
        const {
            firstName,
            lastName,
            email,
            role,
            password,
            matricNumber,
            level,
            department,
        } = registerSchema.parse(req.body);

        // hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create a new User in database
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            role,
        });

        // Create a new Student record if the user role is 'student'
        if (role === 'student') {
            const student = await Student.create({
                id: newUser.id,
                matricNumber,
                department,
                level,
            });
        } else if (role === 'teacher') {
            // Create a new Teacher record if the user role is 'teacher'
            const teacher = await Teacher.create({
                id: newUser.id,
                department,
            });
        }

        res.status(200).json({ message: 'User created successfully' });
        return;
    } catch (error: any) {
        console.log('Error: ', error);
        // Handle validation errors
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: 'Invalid request payload',
                errors: error.errors,
            });
        } else if (error?.name == 'SequelizeUniqueConstraintError') {
            // Handle unique constraint
            res.status(409).json({ message: 'User already exists' });
        } else {
            // Handle other errors
            res.status(500).json({
                message: 'Something went wrong. Please try again later',
            });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        // if (!email || !password) {
        //     res.status(400).json({ message: 'Email and password required' });
        //     return;
        // }
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            res.status(404).json({ message: 'User does not exist' });
            return;
        }
        bcrypt.compare(
            password,
            existingUser?.getDataValue('passwordHash'),
            (err, result) => {
                if (result) {
                    const id = existingUser.getDataValue('id').toString('hex');
                    const accessToken = generateAccessToken({ email, id });
                    const refreshToken = generateRefreshToken({ email, id });

                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        expires: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
                    });
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        expires: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
                        ),
                    });
                    res.status(200).json({
                        message: 'Log in successful',
                        data: { accessToken },
                    });
                    return;
                }
                res.status(401).json({ message: 'Wrong email or password' });
            }
        );
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Email and password required' });
        } else {
            res.status(500).json({
                message: 'Something went wrong. Please try again later',
            });
        }
    }
});

router.post('/logout', (req, res) => {
    res.send('Logged out');
});

export default router;
