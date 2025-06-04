import { Request, Response } from 'express';
import { Class, Course, sequelize, Teacher, User, Venue } from '../models';
import logger from '../utils/logger';
import { ClassSchema } from '../schemas';
import { z } from 'zod';
import { literal, Op } from 'sequelize';
import { prisma } from '../config/db';

async function createClass(req: Request, res: Response) {
  const isValidRequest = ClassSchema.safeParse(req.body);
  if (!isValidRequest.success) {
    res.status(400).json({
      success: false,
      message:
        'You need to provide startTime, endTime, classVenue and courseId',
    });
    return;
  }
  const { id } = req.user;
  const { startTime, endTime, venueId, courseId } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    if (user?.getDataValue('role') !== 'teacher') {
      res.status(403).json({
        success: false,
        message: 'Only teachers can access this route',
      });
      return;
    }
    const newClass = await Class.create({
      teacherId: id,
      courseId,
      venueId,
      startTime,
      endTime,
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
    const classData = await Class.findByPk(classId, {
      include: [
        { model: Venue },
        {
          model: Teacher,
          include: [
            { model: User, attributes: ['firstName', 'lastName', 'email'] },
          ],
        },
        { model: Course, attributes: ['title', 'desc', 'code'], as: 'course' },
      ],
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
    const user = await User.findOne({ where: { id } });
    if (user?.getDataValue('role') === 'teacher') {
      const classData = await Class.findOne({
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

      if (id !== classData?.getDataValue('teacherId')) {
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
      await classData?.update(updateData);

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

async function getOngoingClasses(req: Request, res: Response) {
  const { id, role } = req.user;

  try {
    const currentTime = new Date();
    const ongoingClasses = await Class.findAll({
      where: {
        startTime: {
          [Op.lt]: currentTime,
        },
        endTime: {
          [Op.gt]: currentTime,
        },
      },
      order: [['startTime', 'ASC']],
      include: [
        { model: Venue },
        {
          model: Teacher,
          include: [
            { model: User, attributes: ['firstName', 'lastName', 'email'] },
          ],
        },
        { model: Course, attributes: ['title', 'desc', 'code'], as: 'course' },
      ],
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

async function getRecentClasses(req: Request, res: Response) {
  const { id, role } = req.user;
  const pageStr = req.query.page as string;
  const page = isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr);

  const pageSize = 10;
  try {
    const totalClasses = await prisma.class.count();
    const recentClasses = await prisma.class.findMany({
      include: {
        teacher: true,
        venue: true,
      },
    });
    // const recentClasses = await Class.findAndCountAll({
    //   where: {
    //     startTime: {
    //       [Op.lt]: new Date(),
    //     },
    //   },
    //   order: [['startTime', 'DESC']],
    //   limit: pageSize,
    //   offset: (page - 1) * pageSize,
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
    //   attributes: {
    //     include: [
    //       [
    //         literal(`
    //       EXISTS (
    //         SELECT 1
    //         FROM attendance
    //         WHERE attendance."ClassId" = "Class"."id"
    //         AND attendance."StudentId" = '${id}'
    //       )
    //     `),
    //         'attended',
    //       ],
    //     ],
    //   },
    // });
    res.status(200).json({
      success: true,
      page,
      message: 'Fetched classes successfully',
      data: { recentClasses, totalClasses },
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Sever Error' });
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
        teacher: true,
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
    const classData = await Class.findByPk(classId, {
      include: { model: Venue },
    });
    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found',
      });
      return;
    }
    const user = await User.findByPk(id);
    if (user?.getDataValue('role') === 'student') {
      const currentTime = new Date();

      // checks if the attendance is too early or too late
      if (
        currentTime < classData.getDataValue('startTime') ||
        currentTime > classData.getDataValue('endTime')
      ) {
        res.status(400).json({
          success: false,
          message: 'Attendance is not allowed at this time',
        });
        return;
      }

      // TODO: Check if user's location matxhes the venue of the class

      if (
        studentLocation.latitude ===
          parseFloat(classData.getDataValue('Venue').latitude) &&
        studentLocation.longitude ===
          parseFloat(classData.getDataValue('Venue').longitude)
      ) {
        await sequelize.models.attendance.create({
          StudentId: id,
          ClassId: classData.getDataValue('id'),
        });
        res.status(200).json({
          success: true,
          message: 'Attendance marked successfully',
          data: {
            studentLocation,
            location: typeof classData.getDataValue('Venue').latitude,
          },
        });
        return;
      }
      res.status(403).json({
        success: false,
        message: 'You are not at the class venue',
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
};
