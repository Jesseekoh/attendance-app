import { Request, Response } from 'express';
import logger from '../utils/logger';
import { ClassSchema } from '../schemas';
import { z } from 'zod';
import { prisma } from '../config/db';
import { haversineDistanceMeters, toRadians } from '../utils/helper';

async function createClass(req: Request, res: Response) {
  // validate request body
  const isValidRequest = ClassSchema.safeParse(req.body);
  if (!isValidRequest.success) {
    res.status(400).json({
      success: false,
      message:
        'You need to provide startTime, endTime, classVenue, courseId and departmentId',
    });
    return;
  }
  const { id, role } = req.user;
  const { startTime, endTime, venueId, courseId, departmentId } = req.body;

  try {
    const newClass = await prisma.class.create({
      data: {
        endTime,
        startTime,
        venueId,
        courseId,
        teacherId: id,
        departmentId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Class created successfully',
    });
  } catch (error: any) {
    logger.error(error);
    if (error?.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        success: false,
        message: 'Class already exists',
      });
      return;
    }
    if (error?.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({
        success: false,
        message: 'Class venue or Course does not exist in database',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Error creating class',
    });
  }
}

async function getClass(req: Request, res: Response) {
  const { classId } = req.params;
  const validationResult = z.string().uuid().safeParse(classId);

  if (!validationResult.success) {
    res.status(404).json({
      success: false,
      message: 'Class does not exist',
    });
    return;
  }

  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
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
    if (classData) {
      res.status(200).json({
        success: true,
        message: 'successful',
        data: classData,
      });
      return;
    } else {
      // response if class with specified id is not found
      res.status(404).json({
        success: false,
        message: 'Class does not exist',
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving class details',
      error,
    });
  }
}

async function updateClassDetails(req: Request, res: Response) {
  const { classId } = req.params;
  const { id } = req.user;
  const { courseId, classVenue, startTime, endTime } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'teacher') {
      const classData = await prisma.class.findUnique({
        where: {
          id: classId,
        },
      });

      if (!classData) {
        res.status(404).json({
          success: false,
          message: 'Class not found',
        });
        return;
      }

      if (id !== classData?.teacherId) {
        res.status(403).json({
          success: false,
          message: "You're not authorized to update this class",
        });
        return;
      }

      const updateData: any = {};
      if (courseId) updateData.courseId = courseId;
      if (classVenue) updateData.classVenue = classVenue;
      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
      await prisma.class.update({ where: { id: classId }, data: updateData });

      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Only teachers can update class details',
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating class details',
    });
  }
}

async function getClassAttendance(req: Request, res: Response) {
  const { classId } = req.params;

  try {
    const lectureSession = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!lectureSession) {
      res.status(404).json({
        success: false,
        message: 'Lecture Session not found',
      });
    }
    const { courseId, departmentId } = lectureSession!;

    // get all students enrolled in the course
    const [enrolledStudents, attendanceRecords] = await Promise.all([
      prisma.enrollments.findMany({
        where: {
          courseId,
          student: {
            departmentId,
          },
        },
        select: {
          student: {
            select: {
              userId: true,
              matricNumber: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.attendance.findMany({
        where: { classId },
        select: { studentId: true },
      }),
    ]);

    const presentStudentIds = new Set(
      attendanceRecords.map((record) => record.studentId)
    );

    const formattedEnrolledStudents = enrolledStudents.map((s) => ({
      name: s.student.user.name,
      id: s.student.userId,
      attended: presentStudentIds.has(s.student.userId),
      matricNumber: s.student.matricNumber,
    }));

    // const attendees = enrolledStudents
    //   .filter((s) => !attendedStudentIds.has(s.student.userId))
    //   .map((s) => ({
    //     studentId: s.student.userId,
    //     name: s.student.user.name,

    //   }));

    res.status(200).json({
      success: true,
      message: 'Fetched class attendance successfully',
      data: {
        presentStudentIds: [...presentStudentIds],
        students: formattedEnrolledStudents,
      },
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching attendance' });
  }
}

async function getOngoingClasses(req: Request, res: Response) {
  const { id, role } = req.user;

  try {
    const currentTime = new Date();
    const ongoingClasses = await prisma.class.findMany({
      where: {
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

/**
 * Get recent Lecture sessions for courses a student is enrolled in
 */
async function getRecentClasses(req: Request, res: Response) {
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
        page,
        message: 'Fetched classes successfully',
        data: { recentClasses, totalClasses },
      });
      return;
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Sever Error' });
    return;
  }
}

async function getUpcomingClasses(req: Request, res: Response) {
  const { id, role } = req.user;
  try {
    const upcomingClasses = await prisma.class.findMany({
      where: {
        startTime: { gt: new Date() },
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
    // const upcomingClasses = await Class.findAll({
    //   where: {
    //     startTime: {
    //       [Op.gt]: new Date(),
    //     },
    //   },
    //   order: [['startTime', 'ASC']],
    //   include: [
    //     { model: Venue },
    //     {
    //       model: Teacher,
    //       include: [
    //         { model: User, attributes: ['firstName', 'lastName', 'email'] },
    //       ],
    //     },
    //     { model: Course, attributes: ['title', 'desc', 'code'], as: 'course' },
    //   ],
    // });

    res.status(200).json({
      success: true,
      message: 'Fetched classes successfully',
      data: upcomingClasses,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Sever Error' });
  }
}

async function markAttendance(req: Request, res: Response) {
  const { id } = req.user;
  const { studentLocation } = req.body;
  const { classId } = req.params;
  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { venue: true },
    });
    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found',
      });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'student') {
      const currentTime = new Date();

      // Early submission check
      if (currentTime < classData.startTime!) {
        res.status(400).json({
          success: false,
          message: 'Class has not started. Attendance is not yet allowed.',
        });
        return;
      }

      // Late submission check
      if (currentTime > classData.endTime!) {
        res.status(400).json({
          success: false,
          message: 'Class has ended. Attendance can no longer be marked.',
        });
        return;
      }

      // Validate and compute distance to venue (100 meters threshold)
      if (!studentLocation || typeof studentLocation !== 'object') {
        res.status(400).json({
          success: false,
          message: 'studentLocation with latitude and longitude is required',
        });
        return;
      }

      const studentLat = Number(studentLocation.latitude);
      const studentLng = Number(studentLocation.longitude);
      const venueLat = Number((classData.venue as any)?.latitude);
      const venueLng = Number((classData.venue as any)?.longitude);

      const isValidNumber = (n: number) =>
        Number.isFinite(n) && !Number.isNaN(n);
      if (
        !isValidNumber(studentLat) ||
        !isValidNumber(studentLng) ||
        !isValidNumber(venueLat) ||
        !isValidNumber(venueLng)
      ) {
        res.status(400).json({
          success: false,
          message: 'Invalid latitude/longitude values provided',
        });
        return;
      }

      // Check if student's position is within 100 meters of the lecture venue

      const distanceMeters = haversineDistanceMeters(
        studentLat,
        studentLng,
        venueLat,
        venueLng
      );

      if (distanceMeters > 100) {
        res.status(403).json({
          success: false,
          message:
            'You are not at the class venue (must be within 100 meters).',
        });
        return;
      }

      await prisma.attendance.create({
        data: {
          studentId: id,
          classId: classData?.id,
        },
      });
      res.status(200).json({
        success: true,
        message: 'Attendance marked successfully',
      });
      return;
    }
    res.status(403).json({
      success: false,
      message: 'Only Students can mark attendance',
    });
  } catch (error: any) {
    logger.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(200).json({
        success: true,
        message: 'Attendance marked successfully',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
    });
  }
}

export default {
  createClass,
  getClass,
  getUpcomingClasses,
  getRecentClasses,
  getOngoingClasses,
  updateClassDetails,
  markAttendance,
  getClassAttendance,
};
