import { Request, Response } from 'express';
import { Course, sequelize, User } from '../models';
import logger from '../utils/logger';

// Gets all courses
async function getAllCourses(req: Request, res: Response) {
    try {
        const courses = await Course.findAll();
        res.status(200).json({
            message: 'Courses retrieved successfully',
            data: courses,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An Error occurred' });
    }
}

// Gets all students taking a course
async function getAllCourseStudents(req: Request, res: Response) {
    const { id } = req.user;
    const { courseId } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user?.getDataValue('role') === 'teacher') {
            const query = await sequelize.query(
                'SELECT * FROM "Enrollments"  enrollments INNER JOIN users on enrollments."StudentId" = users.id INNER JOIN "Students" on enrollments."StudentId" = "Students".id where "CourseId" = :courseId',
                {
                    replacements: {
                        courseId,
                    },
                }
            );
            const students = await query[0].map((student: any) => ({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                matricNumber: student.matricNumber,
                level: student.level,
                department: student.department,
            }));

            res.status(200).json({ message: 'Successful', data: students });
        } else {
            res.status(403).json({
                message: 'Only teachers can access this route',
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            message: 'An error occurred retrieving students',
        });
    }
}

export default { getAllCourseStudents, getAllCourses };
