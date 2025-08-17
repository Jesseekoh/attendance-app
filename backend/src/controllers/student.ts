import { Request, Response } from 'express';
import { prisma } from '../config/db';
import logger from '../utils/logger';

async function getAllStudents(req: Request, res: Response) {
  try {
  } catch (error) {}
}

/**
 * Enrolls a student in the specified courses
 */
async function enrollCourses(req: Request, res: Response) {
  const { studentId } = req.params;
  const { courses } = req.body;
  try {
    const user = await prisma.student.findUnique({
      where: { userId: studentId },
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
        (item) => !enrolledCourseIds.includes(item)
      );

      const enrollments = coursesToAdd.map((courseId: string) => ({
        courseId,
        studentId,
      }));

      // await prisma.$transaction(async (tx) => {
      await prisma.enrollments.deleteMany({
        where: {
          studentId,
          courseId: {
            in: coursesToDelete,
          },
        },
      });

      await prisma.enrollments.createMany({
        data: enrollments,
        // skipDuplicates: true,
      });
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
  // const { id, role } = req.user;
  const { studentId } = req.params;
  try {
    const [totalClasses, attendedClasses] = await Promise.all([
      prisma.class.count(),
      prisma.attendance.count({ where: { studentId } }),
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

async function getStudentClasses(req: Request, res: Response) {
  const { studentId } = req.params;

  try {
    const enrollments = await prisma.enrollments.findMany({
      where: { studentId },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) {
      res.status(200).json({
        success: true,
        message: 'Fetched classes successfully',
        data: [],
      });
      return;
    }

    const classes = await prisma.class.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { startTime: 'asc' },
      include: {
        attendance: {
          where: { studentId },
          select: { studentId: true },
        },
        course: true,
        venue: { select: { name: true } },
        teacher: {
          include: {
            user: { select: { email: true, name: true, role: true } },
          },
        },
      },
    });

    const formattedClasses = classes.map((cls) => ({
      ...cls,
      attended: cls.attendance.length > 0,
    }));

    res.status(200).json({
      success: true,
      message: 'Fetched classes successfully',
      data: formattedClasses,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes',
    });
  }
}

export default {
  enrollCourses,
  getStudentCourses,
  getStudentStats,
  getStudentClasses,
};
