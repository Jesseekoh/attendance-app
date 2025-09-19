import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';
import { Roles } from '../constants/role';

// Add courses to list of courses a teacher is teaching
export async function addTeacherCourses(req: Request, res: Response) {
  const { id, role } = req.user;
  const { teacherId } = req.params;
  const { courses }: { courses: string[] } = req.body;

  try {
    if (role === Roles.TEACHER && id !== teacherId) {
      res.status(403).json({
        success: false,
        message: 'You cannot make changes to another teacher account',
      });
      return;
    }
    const teacher = await prisma.teacher.findFirst({
      where: { userId: teacherId },
      include: {
        taught_courses: { select: { course: true } },
      },
    });

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher with provided ID does not exist',
      });
      return;
    }

    const current = new Set(teacher.taught_courses.map((tc) => tc.course.id));
    const incoming = new Set(courses);

    const toAdd = [...incoming]
      .filter((id) => !current.has(id))
      .map((courseId) => ({ courseId, teacherId }));

    const toDelete = [...current].filter((id) => !incoming.has(id));

    await prisma.taught_courses.deleteMany({
      where: { teacherId, courseId: { in: toDelete } },
    });
    await prisma.taught_courses.createMany({
      data: toAdd,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: 'Courses added Successfully',
    });
  } catch (error) {
    console.log(error);
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
  const { teacherId } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }

    const data = await prisma.taught_courses.findMany({
      where: { teacherId },
      select: { course: true },
    });

    const courseList = data.map((item) => item.course);

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved courses',
      data: courseList,
    });
  } catch (error) {
    logger.error('An error occured', error);
    res.status(500).json({
      success: false,
      message: 'An error occured',
      error,
    });
  }
}

export async function getTeacherRecentClasses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, role } = req.user;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }
    const recentClasses = await prisma.class.findMany({
      where: {
        teacherId: id,
        startTime: { lt: new Date() },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        course: {
          select: {
            code: true,
            title: true,
            desc: true,
          },
        },
        venue: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'Fetched recent classes successfully',
      data: recentClasses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherUpcomingClasses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, role } = req.user;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }
    const upcomingClasses = await prisma.class.findMany({
      where: {
        teacherId: id,
        startTime: { gt: new Date() },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        course: {
          select: {
            code: true,
            title: true,
            desc: true,
          },
        },
        venue: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'Fetched upcoming classes classes successfully',
      data: upcomingClasses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherClasses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { teacherId } = req.params;
  const { id, role } = req.user;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }
    const teacherClasses = await prisma.class.findMany({
      where: { teacherId },
      orderBy: { startTime: 'desc' },
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
    res
      .status(200)
      .json({ message: 'successful', success: true, data: teacherClasses });
  } catch (error) {
    logger.error('An error occurred', error);
    next(error);
  }
}
