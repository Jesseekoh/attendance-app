import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import logger from '../utils/logger';
import { Roles } from '../constants/role';

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
  const { id, role } = req.user;
  const { studentId } = req.params;
  try {
    if (role === Roles.STUDENT && id !== studentId) {
      res.status(403).json({
        message: "You cannot access a fellow student's data",
        success: false,
      });

      return;
    }
    const [totalClasses, attendedClasses] = await Promise.all([
      prisma.class.count({
        where: {
          startTime: { lt: new Date() },
        },
      }),
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

/**
 * Get recent Lecture sessions for courses a student is enrolled in
 */
async function getStudentRecentClasses(req: Request, res: Response) {
  const { id, role } = req.user;

  try {
    const pageStr = req.query.page as string;
    const page = isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr);

    const pageSize = 10;
    if (role === 'student') {
      const user = await prisma.student.findUnique({ where: { userId: id } });
      const departmentId = user?.departmentId;

      const enrolledCourses = await prisma.enrollments.findMany({
        where: {
          studentId: id,
        },
        select: {
          courseId: true,
        },
      });

      const enrolledCourseIds = enrolledCourses.map((obj) => obj.courseId);

      const totalClasses = await prisma.class.count();
      const classes = await prisma.class.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: {
          courseId: { in: enrolledCourseIds },
          departmentId,
          endTime: {
            lt: new Date(),
          },
        },
        include: {
          attendance: {
            where: {
              studentId: id,
            },
            select: {
              studentId: true,
            },
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
      let formattedClasses = classes.map((cls) => ({
        ...cls,
        attended: cls.attendance.length > 0,
      }));

      res.status(200).json({
        success: true,
        page,
        message: 'Fetched classes successfully',
        data: { recentClasses: formattedClasses, totalClasses },
      });
      return;
    } else if (role === 'teacher') {
      const totalClasses = await prisma.class.count({
        where: { teacherId: id },
      });
      const recentClasses = await prisma.class.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: {
          teacherId: id,
          endTime: {
            lt: new Date(),
          },
        },
        include: {
          _count: {
            select: {
              attendance: true,
            },
          },
          venue: true,
          teacher: {
            include: {
              user: true,
            },
          },
          course: true,
        },
      });

      const classes = await prisma.$queryRaw`
        SELECT 
          c.id,
          c."courseId",
          c."departmentId",
          COUNT(DISTINCT s."userId")::INT AS studentCount
        FROM "Class" c
        JOIN "Enrollments" e ON e."courseId" = c."courseId"
        JOIN "Student" s ON s."userId" = e."studentId"
        WHERE c."teacherId" = ${id}
          AND s."departmentId" = c."departmentId"
        GROUP BY c.id, c."courseId", c."departmentId"
      `;
      // console.log(classes);
      // for (const i of classes) {
      //   i[studentCount] = Number;
      // }
      res.status(200).json({
        success: true,
        page,
        classes,
        message: 'Fetched classes successfully',
        data: { recentClasses, totalClasses },
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Sever Error' });
    return;
  }
}

async function getStudentUpcomingClasses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, role } = req.user;
  try {
    const user = await prisma.student.findUnique({ where: { userId: id } });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const enrolledCourses = await prisma.enrollments.findMany({
      where: {
        studentId: id,
      },
      select: {
        courseId: true,
      },
    });

    const enrolledCourseIds = enrolledCourses.map((obj) => obj.courseId);

    const upcomingClasses = await prisma.class.findMany({
      where: {
        startTime: { gt: new Date() },
        courseId: { in: enrolledCourseIds },
        departmentId: user.departmentId,
      },
      include: {
        venue: true,
        teacher: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Fetched classes successfully',
      data: upcomingClasses,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Sever Error' });
  }
}
async function getStudentOngoingClasses(req: Request, res: Response) {
  const { id, role } = req.user;

  try {
    const student = await prisma.student.findUnique({ where: { userId: id } });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    const currentTime = new Date();

    const enrolledCourses = await prisma.enrollments.findMany({
      where: { studentId: id },
      select: { courseId: true },
    });
    const enrolledCourseIds = enrolledCourses.map((c) => c.courseId);
    const ongoingClasses = await prisma.class.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        departmentId: student.departmentId,
        startTime: {
          lt: currentTime,
        },
        endTime: {
          gt: currentTime,
        },
      },
      orderBy: { startTime: 'asc' },
      include: {
        course: true,
        venue: { select: { name: true } },
        teacher: {
          include: {
            user: { select: { email: true, name: true, role: true } },
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'Fetched classes successfully',
      data: ongoingClasses,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Error fetching classes' });
  }
}

export default {
  enrollCourses,
  getStudentCourses,
  getStudentRecentClasses,
  getStudentUpcomingClasses,
  getStudentStats,
  getStudentOngoingClasses,
  getStudentClasses,
};
