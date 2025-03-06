import { Request, Response } from 'express';
import { Course, sequelize, Teacher } from '../models';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger';

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
            const teacherCourses =
                await sequelize.models.taught_courses.bulkCreate(
                    taughtCourses,
                    {
                        updateOnDuplicate: ['CourseId', 'TeacherId'],
                    }
                );

            res.status(200).json({ message: 'Courses added Successfully' });
        } else {
            res.status(403).json({
                message: 'Only teachers can teach courses',
            });
        }
    } catch (error) {
        logger.error('An error occurred', error);
        res.status(500).json({ message: 'Something went wrong. Try again' });
    }
}

export async function getTeacherCourses(req: Request, res: Response) {
    const { id } = req.user;

    try {
        const teacher = await Teacher.findOne({ where: { id } });
        if (teacher) {
            // Get all the courses taught by a teacher
            const data = await Teacher.findOne({
                where: { id },
                include: {
                    model: Course,
                    through: { attributes: [] },
                },
            });

            const courses: Course[] | undefined = data?.Courses;

            res.status(200).json(courses);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        logger.error('An error occured', error);
        res.status(500).json({ message: 'An error occured', error });
    }
}
