import { prisma } from '../config/db';
import { Request, Response } from 'express';
import { User, Student, Teacher, sequelize } from '../models';
import logger from '../utils/logger';
import { Prisma } from '../../generated/prisma';

// Function to register a new user
export const registerUser = async (req: Request, res: Response) => {
  // try {
  //   // parse and validate request body using register schema
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     role,
  //     password,
  //     matricNumber,
  //     level,
  //     department,
  //   } = RegisterSchema.parse(req.body);
  //   // hash password
  //   const saltRounds = 10;
  //   const passwordHash = await bcrypt.hash(password, saltRounds);
  //   // Create a new User in database
  //   await prisma.$transaction(async (tx) => {
  //     const newUser = await tx.users.create({
  //       data: {
  //         firstName,
  //         lastName,
  //         email: email.toLocaleLowerCase(),
  //         passwordHash,
  //         role,
  //       },
  //     });
  //     if (role === 'student') {
  //       const student = await tx.students.create({
  //         data: {
  //           id: newUser.id,
  //           matricNumber,
  //           department,
  //           level: Number(level),
  //         },
  //       });
  //     } else if (role === 'teacher') {
  //       const teacher = await tx.teachers.create({
  //         data: {
  //           id: newUser.id,
  //           department,
  //         },
  //       });
  //     }
  //   });
  //   logger.info('User registered successfully');
  //   res.status(200).json({
  //     success: true,
  //     message: 'User created successfully',
  //   });
  // } catch (error: any) {
  //   logger.error('Error: ', error);
  //   // Handle validation errors
  //   if (error instanceof z.ZodError) {
  //     res.status(400).json({
  //       success: false,
  //       message: 'Invalid request payload',
  //       errors: error.errors,
  //     });
  //   } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //     // Handle unique constraint
  //     if (error.code === 'P2002') {
  //       res.status(409).json({
  //         success: false,
  //         message: 'User already exists',
  //       });
  //     }
  //   } else {
  //     // Handle other errors
  //     res.status(500).json({
  //       success: false,
  //       message: 'Something went wrong. Please try again later',
  //     });
  //   }
  // }
};

// Function to get the profile of the currently logged in user
export const getMyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, role } = req.user;

  try {
    let user;
    if (role === 'student') {
      user = await User.findOne({
        where: { id },
        include: [
          {
            model: Student,
            attributes: ['matricNumber', 'department', 'level'],
          },
        ],
      });
    }
    if (role === 'teacher') {
      user = await User.findOne({
        where: { id },
        include: [
          {
            model: Teacher,
            attributes: ['department'],
          },
        ],
      });
    }
    if (user) {
      const { passwordHash, createdAt, updatedAt, ...userWithoutPasswordHash } =
        user.dataValues;
      res.status(200).json({
        success: true,
        message: 'Successfully returned user data',
        data: userWithoutPasswordHash,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    logger.error('An error occured: ', error);
    res.status(500).json({
      success: false,
      message: 'An error occured',
      error,
    });
  }
  return;
};

export default {
  getMyProfile,
  registerUser,
};
