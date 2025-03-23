import { Request, Response } from 'express';
import { Class, sequelize, User, Venue } from '../models';
import logger from '../utils/logger';
import { Sequelize } from 'sequelize';

async function createClass(req: Request, res: Response) {
    const { id } = req.user;
    const { startTime, endTime, venueId, courseId } = req.body;

    if (!(startTime && endTime && venueId && courseId)) {
        res.status(400).json({
            message:
                'You need to provide startTime, endTime, classVenue and courseId',
        });
        return;
    }
    try {
        const user = await User.findOne({ where: { id } });
        if (user?.getDataValue('role') !== 'teacher') {
            res.status(403).json({
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

        res.status(200).json({ message: 'Class created successfully' });
    } catch (error: any) {
        logger.error(error);
        if (error?.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                success: false,
                message: 'Class already exists',
            });
        }
        if (error?.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({
                success: false,
                message: 'Class venue or Course does not exist in database',
            });
            return;
        }
        res.status(500).json({ message: 'Error creating class' });
    }
}

async function getClass(req: Request, res: Response) {
    const { classId } = req.params;
    try {
        const classData = await Class.findByPk(classId, {
            include: { model: Venue },
        });
        if (classData) {
            res.status(200).json({ message: 'successful', data: classData });
            return;
        } else {
            // response if class with specified id is not found
            res.status(404).json({ message: 'Class does not exist' });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
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
                res.status(404).json({ message: 'Class not found' });
                return;
            }

            if (id !== classData?.getDataValue('teacherId')) {
                res.status(403).json({
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

            res.status(200).json({ message: 'Class updated successfully' });
        } else {
            res.status(403).json({
                message: 'Only teachers can update class details',
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error updating class details' });
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
            res.status(404).json({ message: 'Class not found' });
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
                    message: 'Attendance marked successfully',
                    data: {
                        studentLocation,
                        location:
                            typeof classData.getDataValue('Venue').latitude,
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
        res.status(403).json({ message: 'Only Students can mark attendance' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error marking attendance' });
    }
}

export default {
    createClass,
    getClass,
    updateClassDetails,
    markAttendance,
};
