import { Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';

// Gets all courses
async function getAllCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'An Error occurred' });
  }
}

// Gets all students taking a course
async function getAllCourseStudents(req: Request, res: Response) {
  const { id } = req.user;
  const { courseId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'teacher') {
      const students = await prisma.enrollments.findMany({
        where: {
          courseId: courseId,
        },
        select: {
          student: {
            include: { user: true },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Successful',
        // data: students,
        data: students,
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Only teachers can access this route',
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred retrieving students',
    });
  }
}

export default { getAllCourseStudents, getAllCourses };
