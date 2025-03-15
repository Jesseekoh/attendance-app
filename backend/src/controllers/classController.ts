import { Request, Response } from 'express';
import { Class, Teacher, User } from '../models';
import { ITokenPayload } from '../types';
import logger from '../utils/logger';

async function createClass(req: Request, res: Response) {
    const { id } = req.user as ITokenPayload;
    const { startTime, endTime, classVenue, courseId } = req.body;

    if (!(startTime && endTime && classVenue && courseId)) {
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
                message: 'Only teachers can create classes',
            });
            return;
        }
        const newClass = await Class.create({
            teacherId: id,
            courseId,
            location: classVenue,
            startTime,
            endTime,
        });

        res.status(200).json({ message: 'Class created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating class' });
    }
}

async function getClass(req: Request, res: Response) {
    const { classId } = req.params;
    try {
        const classData = await Class.findOne({
            where: { id: classId },
        });
        if (classData) {
            res.status(200).json({ message: 'successful', data: classData });
            return;
        } else {
            // response if class with specified id is not found
            res.status(404).json({ message: 'Class does not exist' });
        }
    } catch (error) {
        logger.info(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
}

export default { createClass, getClass };
