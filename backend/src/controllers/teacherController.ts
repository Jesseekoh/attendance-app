import { Request, Response } from 'express';
import { Course, Teacher } from '../models';

export async function addTeacherCourses(req: Request, res: Response) {
    const { id } = req.user;
    const { courses } = req.body;

    try {
        const teacher = await Teacher.findOne({ where: { id } });

        const taughtCourses = courses.map((CourseId: string) => ({
            TeacherId: id,
            CourseId,
        }));
        if (teacher) {
            const teacherCourses = await Teacher.bulkCreate(taughtCourses, {
                include: [courses],
            });

            res.status(200).json({ message: 'Courses added Successfully' });
        }

        res.status(403).json({ message: 'Only teachers can teach coursess' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong. Try again' });
    }
}

export async function getTeacherCourses(req: Request, res: Response) {
    const { id } = req.user;

    try {
        const teacher = await Teacher.findOne({ where: { id } });
        if (teacher) {
            // Get all the courses taught by a teacher
            const courses = await Teacher.findOne({
                where: { id },
                include: {
                    model: Course,
                },
            });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.log('An error occured', error);
        res.status(500).json({ message: 'An error occured', error });
    }
}
