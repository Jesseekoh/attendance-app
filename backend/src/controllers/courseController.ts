import { Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';

// Gets all courses
async function getAllCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'An Error occurred' });
  }
}

// Gets all students taking a course
async function getAllCourseStudents(req: Request, res: Response) {
  const { id } = req.user;
  const { courseId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'teacher') {
      const query =
        await prisma.$queryRaw`SELECT * FROM "Enrollments"  enrollments INNER JOIN users on enrollments."StudentId" = users.id INNER JOIN "Students" on enrollments."StudentId" = "Students".id where "CourseId" = :courseId`;

      // const students = query[0].map((student: any) => ({
      //   id: student.id,
      //   firstName: student.firstName,
      //   lastName: student.lastName,
      //   email: student.email,
      //   matricNumber: student.matricNumber,
      //   level: student.level,
      //   department: student.department,
      // }));

      res.status(200).json({
        success: true,
        message: 'Successful',
        // data: students,
        data: [],
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Only teachers can access this route',
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred retrieving students',
    });
  }
}

export default { getAllCourseStudents, getAllCourses };
