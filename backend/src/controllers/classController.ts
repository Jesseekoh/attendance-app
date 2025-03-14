import { Request, Response } from 'express';
import { Class, User } from '../models';
import { ITokenPayload } from '../types';

async function createClass(req: Request, res: Response) {
    const { id } = req.user as ITokenPayload;
    const { startTime, endTime, classVenue, courseId } = req.body;
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
    } catch (error) {}
}

async function getClass(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const classData = await Class.findOne({ where: { id } });
        res.status(200).json({ message: 'successful', data: classData });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}

export default { createClass, getClass };
