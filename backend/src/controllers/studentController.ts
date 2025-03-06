import { Request, Response } from 'express';
import { Course, Enrollment, Student, User } from '../models';
import logger from '../utils/logger';

/**
 * Enrolls a student in the specified courses
 */
export async function enrollCourses(req: Request, res: Response) {
    const { id } = req.user;
    const { courses } = req.body;
    try {
        const user = await Student.findOne({ where: { id } });
        if (user) {
            const enrollments = courses.map((courseId: string) => ({
                CourseId: courseId,
                StudentId: id,
            }));
            await Enrollment.bulkCreate(enrollments, {
                updateOnDuplicate: ['CourseId', 'StudentId'],
            });

            res.status(200).json({ message: 'Successfully enrolled courses' });
        } else {
            res.status(403).json({
                message: 'Only students can enroll courses',
            });
        }
    } catch (error: any) {
        logger.error('An error occured', error);
        res.status(500).json({
            message: 'Something went wrong. Please try again',
            error: error.message,
        });
    }
}

export async function getStudentCourses(req: Request, res: Response) {
    const { id } = req.user;

    try {
        const student = await Student.findOne({ where: { id } });

        if (student) {
            // get all courses a student is enrolled in
            const data = await Student.findOne({
                where: { id },
                include: {
                    model: Course,
                    attributes: ['id', 'code', 'title'],
                    through: { attributes: [] },
                },
            });

            const courses: Course[] | undefined = data?.Courses;

            if (courses) {
                res.status(200).json({
                    message: 'Successfully fetched data',
                    data: { courses },
                });
            } else {
                res.status(200).json({
                    message: 'Student is enrolled in no courses',
                });
            }
        } else {
            // response if no student is found
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        logger.error('An error occured', error);
        res.status(500).json({
            message: 'Something went wrong. Please try again',
        });
    }
}
