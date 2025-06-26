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
    const user = await prisma.student.findUnique({
      where: { userId: id },
      include: { enrollments: { select: { course: true } } },
    });
    if (user) {
      // Handle deleting records that are not in req.body.courses
      const enrolledCourseIds = user.enrollments.map((item) => item.course.id);
      const updatedCoursesSet: Set<string> = new Set(courses);
      // filter courses that are in the students enrollments but not in req.body.courses

      const coursesToDelete = [...enrolledCourseIds].filter(
        (course) => !updatedCoursesSet.has(course)
      );

      const coursesToAdd: string[] = [...updatedCoursesSet].filter(
        (item) => !coursesToDelete.includes(item)
      );

      const enrollments = coursesToAdd.map((courseId: string) => ({
        courseId,
        studentId: id,
      }));

      await prisma.enrollments.deleteMany({
        where: {
          studentId: id,
          courseId: {
            in: coursesToDelete,
          },
        },
      });

      await prisma.enrollments.createMany({
        data: enrollments,
        skipDuplicates: true,
      });

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
      let enrollments = await prisma.enrollments.findMany({
        where: { studentId: id },
        select: {
          course: true,
        },
      });

      const courses = enrollments.map((i) => i.course);

      res.status(200).json({
        success: true,
        message: 'Successfully fetched courses',
        data: courses,
      });
    } else {
      // response if no student is found
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }
  } catch (error) {
    logger.error('An error occurred', error);
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
