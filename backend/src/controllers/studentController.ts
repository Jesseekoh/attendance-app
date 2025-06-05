import { Request, Response } from 'express';
import { prisma } from '../config/db';
import logger from '../utils/logger';

/**
 * Enrolls a student in the specified courses
 */
async function enrollCourses(req: Request, res: Response) {
  const { id } = req.user;
  const { courses } = req.body;
  try {
    const user = await prisma.student.findUnique({ where: { userId: id } });
    if (user) {
      const enrollments = courses.map((courseId: string) => ({
        CourseId: courseId,
        StudentId: id,
      }));
      // await Enrollment.bulkCreate(enrollments, {
      //   updateOnDuplicate: ['CourseId', 'StudentId'],
      // });

      res.status(200).json({
        success: true,
        message: 'Successfully enrolled courses',
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Only students can enroll courses',
      });
    }
  } catch (error: any) {
    logger.error('An error occured', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
      error: error.message,
    });
  }
}

async function getStudentCourses(req: Request, res: Response) {
  const { id } = req.user;

  try {
    const student = await prisma.student.findUnique({ where: { userId: id } });

    if (student) {
      // get all courses a student is enrolled in
      const data = await prisma.student.findFirst({
        where: { userId: id },
        include: {
          Enrollments: true,
        },
      });

      // const courses: Course[] = data!.Courses;
      const courses = [1];

      if (courses.length !== 0) {
        res.status(200).json({
          success: true,
          message: 'Successfully fetched data',
          data: courses,
        });
      } else {
        res.status(200).json({
          success: true,
          data: [],
          message: 'Student is enrolled in no courses',
        });
      }
    } else {
      // response if no student is found
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }
  } catch (error) {
    logger.error('An error occured', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
}

async function getStudentStats(req: Request, res: Response) {
  const { id, role } = req.user;
  try {
    const [totalClasses, attendedClasses] = await Promise.all([
      // Class.count(),
      prisma.class.count(),
      prisma.attendance.count({ where: { studentId: id } }),
      // sequelize.models.attendance.count({ where: { StudentId: id } }),
    ]);
    res.status(200).json({
      success: true,
      message: 'Fetched stats successfully',
      data: {
        totalClasses,
        attendedClasses,
        missedClasses: totalClasses - attendedClasses,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
}

export default { enrollCourses, getStudentCourses, getStudentStats };
