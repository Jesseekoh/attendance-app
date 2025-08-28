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
    const course = await prisma.course.findFirst({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ success: false, message: 'course not found' });
    }
    const students = await prisma.enrollments.findMany({
      where: {
        courseId,
      },
      select: {
        student: {
          include: { user: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Fetched students successfully',
      data: students,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred retrieving students',
    });
  }
}

async function getCourseAttendanceRecord(req: Request, res: Response) {
  const { courseId } = req.params as { courseId: string };

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    // Get enrolled students (with user details) for this course
    const enrollments = await prisma.enrollments.findMany({
      where: { courseId },
      include: {
        student: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });

    const enrolledStudents = enrollments.map((e) => e.student);
    const studentById = new Map(enrolledStudents.map((s) => [s.userId, s]));

    // Get all classes for this course with their attendance records
    const classes = await prisma.class.findMany({
      where: { courseId },
      orderBy: { startTime: 'asc' },
      include: {
        attendance: { select: { studentId: true } },
        venue: { select: { name: true } },
        teacher: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    const data = classes.map((cls) => {
      const attendedUserIds = new Set(cls.attendance.map((a) => a.studentId));

      const attendees = enrolledStudents
        .filter((s) => attendedUserIds.has(s.userId))
        .map((s) => ({
          studentId: s.userId,
          userId: s.userId,
          name: s.user?.name,
          email: s.user?.email,
        }));

      const absentees = enrolledStudents
        .filter((s) => !attendedUserIds.has(s.userId))
        .map((s) => ({
          studentId: s.userId,
          userId: s.userId,
          name: s.user?.name,
          email: s.user?.email,
        }));

      return {
        ...cls,
        attendees,
        absentees,
        counts: { attended: attendees.length, missed: absentees.length },
      };
    });

    res.status(200).json({
      success: true,
      message: 'Fetched course classes with attendance successfully',
      data,
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching course attendance' });
  }
}

export default {
  getAllCourseStudents,
  getAllCourses,
  getCourseAttendanceRecord,
};
