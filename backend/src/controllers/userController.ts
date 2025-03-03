import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
import { User, Student, Teacher, sequelize } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/helper';

// Function to register a new user
export const registerUser = async (req: Request, res: Response) => {
    // Start transaction so I can rollback any changes if any DB operation fails
    const transaction = await sequelize.transaction();
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
        const newUser = await User.create(
            {
                firstName,
                lastName,
                email,
                passwordHash,
                role,
            },
            { transaction }
        );

        // Create a new Student record if the user role is 'student'
        if (role === 'student') {
            const student = await Student.create(
                {
                    id: newUser.id,
                    matricNumber,
                    department,
                    level,
                },
                { transaction }
            );
        } else if (role === 'teacher') {
            // Create a new Teacher record if the user role is 'teacher'
            const teacher = await Teacher.create(
                {
                    id: newUser.id,
                    department,
                },
                { transaction }
            );
        }
        await transaction.commit();
        res.status(200).json({ message: 'User created successfully' });
        return;
    } catch (error: any) {
        await transaction.rollback();
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
};

// Function to log in a user
export const logInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);
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
                    const id = existingUser.getDataValue('id');
                    const role = existingUser.getDataValue('role');
                    const accessToken = generateAccessToken({ role, id });
                    const refreshToken = generateRefreshToken({ role, id });

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
};

// Function to log out user
export const logOutUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.clearCookie('refreshToken');
};

// Function to refresh access token
export const refreshToken = async (
    req: Request,
    res: Response
): Promise<void> => {};

// Function to get the profile of the currently logged in user
export const getMyProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.user;
    const user = await User.findOne({
        where: { id },
    });

    res.json({ status: 'success', data: { user } });
    return;
};

export const getUserCourses = async (req: Request, res: Response) => {
    const { id } = req.user;
};
