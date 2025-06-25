import { Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';

export async function addTeacherCourses(req: Request, res: Response) {
  const { id } = req.user;
  const { courses } = req.body;

  try {
    const teacher = await prisma.teacher.findFirst({ where: { userId: id } });

    const taughtCourses = courses.map((CourseId: string) => ({
      TeacherId: id,
      CourseId,
    }));
    if (teacher) {
      console.log('bulaba');
      const teacherCourses = await prisma.taught_courses.createMany(
        { data: taughtCourses, skipDuplicates: true }
        // {
        //   updateOnDuplicate: ['CourseId', 'TeacherId'],
        // }
      );

      res.status(200).json({
        success: true,
        message: 'Courses added Successfully',
      });
    } else {
      // todo: make middleware to manage access control
      res.status(403).json({
        success: false,
        message: 'Only teachers can teach courses',
      });
    }
  } catch (error) {
    logger.error('An error occurred', error);
    res.status(500).json({
      success: false,
      error,
      message: 'Something went wrong. Try again',
    });
  }
}

export async function getTeacherCourses(req: Request, res: Response) {
  const { id } = req.user;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });
    if (teacher) {
      //   // Get all the courses taught by a teacher
      const data = await prisma.taught_courses.findMany({
        where: { teacherId: id },
        select: { course: true },
      });

      const courseList = data.map((item) => item.course);

      res.status(200).json({
        success: true,
        message: 'Successfully retrieved courses',
        data: courseList,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
  } catch (error) {
    logger.error('An error occured', error);
    res.status(500).json({
      success: false,
      message: 'An error occured',
      error,
    });
  }
}
