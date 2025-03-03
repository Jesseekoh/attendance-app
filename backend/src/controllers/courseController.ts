import { Request, Response } from 'express';
import { Enrollment, User } from '../models';

export async function enrollCourses(req: Request, res: Response) {
    const { id } = req.user;
    const { courses } = req.body;
    try {
        const user = await User.findOne({ where: { id } });
        if (user?.role === 'student') {
            const enrollments = courses.map((courseId: string) => ({
                CourseId: courseId,
                StudentId: id,
            }));
            await Enrollment.bulkCreate(enrollments, {
                updateOnDuplicate: ['CourseId', 'StudentId'],
            });

            res.status(200).json({ message: 'Successfully enrolled courses' });
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong. Please try again',
            error: error.message,
        });
    }
}
