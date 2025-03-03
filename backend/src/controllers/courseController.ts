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
            await Enrollment.bulkCreate(enrollments);
        }
    } catch (error) {
        console.log(error);
    }
}
